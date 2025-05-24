import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setConversationTitle, setConversationMessage, setMessageIntent } from "../api/conversation/conversationSlicer";
import { stream } from "../api/stream/streamSlicer";
import { useAuth } from "../context/authContext";

export default function useAgentSocket() {
  const dispatch = useDispatch();
  const [currentIntent, setCurrentIntent] = useState(null);

  const [feedbackData, setFeedbackData] = useState({});
  const { isLogin } = useAuth();
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;

  const refreshToken = async () => {
    try {
      console.log("[useAgentSocket] Token yenileniyor...");
  
      // Cookie'den refresh_token'ı oku
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
  
      const refreshToken = getCookie("refresh_token");
      console.log("[useAgentSocket] refresh_token:", refreshToken);
  
      if (!refreshToken) {
        throw new Error("Refresh token bulunamadı");
      }
  
      const response = await fetch("/refresh-token", {
        method: "POST",
        credentials: "include", // ✨ Cookie'yi isteğe eklemesi için
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
  
      if (!response.ok) {
        throw new Error("Token yenileme başarısız");
      }
  
      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);
      console.log("[useAgentSocket] access_token yenilendi");
      return access_token;
    } catch (error) {
      console.error("[useAgentSocket] Token yenileme hatası:", error);
      throw error;
    }
  };

  const connectSocket = async () => {
    if (!isLogin) {
      console.log("[useAgentSocket] Giriş yapılmadı", userid, isLogin, "Zaman:", new Date().toISOString());
      return;
    }
  
    let userid = localStorage.getItem("userid")?.replace(/^"|"$/g, "");
    if (!userid) {
      console.error("[useAgentSocket] UserID bulunamadı. Zaman:", new Date().toISOString());
      return;
    }
  
    // Zaten bağlıysa tekrar bağlanma
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("[useAgentSocket] WebSocket zaten açık, tekrar bağlanılmadı. Zaman:", new Date().toISOString());
      return;
    }
  
    let token = localStorage.getItem("access_token");
    if (!token) {
      console.log("[useAgentSocket] access_token bulunamadı. Zaman:", new Date().toISOString());
      try {
        // token = await refreshToken(); // Token yenileme fonksiyonunuzu aktifleştirin
        console.error("[useAgentSocket] Token yenileme fonksiyonu eksik. Bağlantı iptal. Zaman:", new Date().toISOString());
        return;
      } catch (error) {
        console.error("[useAgentSocket] Token alınamadı, bağlantı iptal:", error.message, "Zaman:", new Date().toISOString());
        return;
      }
    }
  
    const socketUrl = `${process.env.REACT_APP_WS_URL || "ws://localhost:5001"}`; // Token'ı URL'den kaldır
    console.log("[useAgentSocket] Bağlanılıyor:", socketUrl, "Zaman:", new Date().toISOString());
  
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;
  
    socket.onopen = () => {
      console.log("[useAgentSocket] WebSocket bağlantısı kuruldu. Zaman:", new Date().toISOString());
      reconnectAttempts.current = 0;
      // Mikro gecikme ekle
      setTimeout(() => {
        const userIdStr = userid.toString();
        console.log("[useAgentSocket] Kullanılan userid:", userIdStr, "Zaman:", new Date().toISOString());
        socket.send(
          JSON.stringify({
            event: "identify",
            data: { userid: userIdStr, token: token }, // Token'ı mesaj gövdesine ekle
          })
        );
        console.log("[useAgentSocket] Identify mesajı gönderildi:", { userid: userIdStr, token: token ? "Mevcut" : "Eksik" }, "Zaman:", new Date().toISOString());
      }, 100);
    };
  
    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        const { event: eventType, data } = parsedData;
        console.log("[useAgentSocket] Mesaj alındı:", { eventType, data }, "Zaman:", new Date().toISOString());
  
        if (eventType === "identify_success") {
          console.log("[useAgentSocket] Doğrulama başarılı:", data.message, "Zaman:", new Date().toISOString());
        } else if (eventType === "intent") {
          console.log("[useAgentSocket] Intent alındı:", data.intent, "Zaman:", new Date().toISOString());
          setCurrentIntent(data.intent);
        } else if (eventType === "create_message") {
          console.log("[useAgentSocket] Yeni Sistem Mesaj oluşturuldu:", data.messages, "Zaman:", new Date().toISOString());
          setCurrentIntent(data.messages.system_message.intent);
          dispatch(setMessageIntent(data.messages.system_message.intent));
          dispatch(setConversationMessage(data));
        } else if (eventType === "agent-feedback") {
          const mcp = data;
          console.log("[useAgentSocket] MCP feedback:", mcp, "Zaman:", new Date().toISOString());
          dispatch(stream(mcp.delta?.content));
          if (currentIntent) {
            setFeedbackData((prev) => {
              const currentList = prev[currentIntent] || [];
              let newContent = [];
              if (mcp.delta?.content) {
                newContent = [mcp.delta.content];
              } else if (mcp.messages?.length > 0) {
                newContent = mcp.messages.filter((m) => m.content).map((m) => m.content);
              }
              return {
                ...prev,
                [currentIntent]: [...currentList, ...newContent],
              };
            });
          } else {
            console.warn("[useAgentSocket] Intent belirlenmeden feedback alındı:", mcp, "Zaman:", new Date().toISOString());
          }
        } else if (eventType === "agent-update-title") {
          console.log("[useAgentSocket] Yeni konuşma başlığı:", data.title, "Zaman:", new Date().toISOString());
          dispatch(setConversationTitle(data));
        } else if (eventType === "error") {
          console.error("[useAgentSocket] Sunucu hatası:", data.message, "Zaman:", new Date().toISOString());
          if (data.message.includes("token")) {
            console.log("[useAgentSocket] Token hatası, yenileniyor... Zaman:", new Date().toISOString());
            refreshToken()
              .then(() => connectSocket())
              .catch(() => {
                console.error("[useAgentSocket] Yeniden bağlantı başarısız. Zaman:", new Date().toISOString());
              });
          }
        } else {
          console.warn("[useAgentSocket] Bilinmeyen event tipi:", eventType, "Zaman:", new Date().toISOString());
        }
      } catch (error) {
        console.error("[useAgentSocket] Mesaj parse hatası:", error.message, "Ham veri:", event.data, "Zaman:", new Date().toISOString());
      }
    };
  
    socket.onclose = (event) => {
      console.log(
        "[useAgentSocket] WebSocket bağlantısı kapandı:",
        { code: event.code, reason: event.reason },
        "Zaman:",
        new Date().toISOString()
      );
      if (event.code === 1008) {
        console.log("[useAgentSocket] Token geçersiz, yenileniyor... Zaman:", new Date().toISOString());
        refreshToken()
          .then(() => {
            reconnectAttempts.current = 0;
            connectSocket();
          })
          .catch(() => {
            console.error("[useAgentSocket] Token yenileme başarısız. Zaman:", new Date().toISOString());
            if (reconnectAttempts.current < maxReconnectAttempts) {
              setTimeout(() => {
                console.log("[useAgentSocket] Yeniden bağlanıyor... Deneme:", reconnectAttempts.current + 1, "Zaman:", new Date().toISOString());
                reconnectAttempts.current += 1;
                connectSocket();
              }, reconnectInterval);
            }
          });
      } else if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          console.log("[useAgentSocket] Yeniden bağlanıyor... Deneme:", reconnectAttempts.current + 1, "Zaman:", new Date().toISOString());
          reconnectAttempts.current += 1;
          connectSocket();
        }, reconnectInterval);
      } else {
        console.error("[useAgentSocket] Maksimum yeniden bağlanma denemesi aşıldı. Zaman:", new Date().toISOString());
      }
    };
  
    socket.onerror = (error) => {
      console.error("[useAgentSocket] WebSocket hatası:", error, "Zaman:", new Date().toISOString());
    };
  };

  useEffect(() => {
    if (isLogin) {
      console.log("[useAgentSocket] useEffect tetiklendi, bağlanıyor...");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("[useAgentSocket] WebSocket bağlantısı kapatıldı");
      }
    };
  }, [isLogin]);




  return { currentIntent, connectSocket };
}