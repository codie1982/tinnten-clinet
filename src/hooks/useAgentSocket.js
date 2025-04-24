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
      const response = await fetch("/refresh-token", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` },
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
      console.log("[useAgentSocket] Giriş yapılmadı", userid, isLogin);
      return;
    }

    let userid = localStorage.getItem("userid")?.replace(/^"|"$/g, '');

    // Zaten bağlıysa tekrar bağlanma
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("[useAgentSocket] WebSocket zaten açık, tekrar bağlanılmadı");
      return;
    }

    let token = localStorage.getItem("access_token");
    if (!token) {
      console.log("[useAgentSocket] access_token bulunamadı");
      try {
        token = await refreshToken();
      } catch (error) {
        console.error("[useAgentSocket] Token alınamadı, bağlantı iptal");
        return;
      }
    }

    const socketUrl = `${process.env.REACT_APP_WS_URL || "ws://localhost:5001/stream"
      }?token=${token}`;
    console.log("[useAgentSocket] Bağlanılıyor:", socketUrl);

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[useAgentSocket] WebSocket bağlantısı kuruldu");
      reconnectAttempts.current = 0;
      // Mikro gecikme ekle
      setTimeout(() => {
        const userIdStr = userid.toString(); // String’e çevir
        console.log("[useAgentSocket] Kullanılan userid:", userIdStr);
        socket.send(
          JSON.stringify({
            event: "identify",
            data: { userid: userIdStr },
          })
        );
        console.log("[useAgentSocket] Identify mesajı gönderildi:", { userid: userIdStr });
      }, 100); // 100ms gecikme
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        const { event: eventType, data } = parsedData;
        //console.log("[useAgentSocket] Mesaj alındı:", { eventType, data });

        if (eventType === "identify_success") {
          console.log("[useAgentSocket] Doğrulama başarılı:", data.message);
        } else if (eventType === "intent") {
          console.log("[useAgentSocket] Intent alındı:", data.intent);
          setCurrentIntent(data.intent);
        } else if (eventType === "create_message") {
          // data: { messages }
          console.log("[useAgentSocket] Yeni Sistem Mesaj oluşturuldu:", data.messages);
          setCurrentIntent(data.messages.system_message.intent)
          dispatch(setMessageIntent(data.messages.system_message.intent))
          dispatch(setConversationMessage(data))


        } else if (eventType === "agent-feedback") {
          const mcp = data;
          //console.log("[useAgentSocket] MCP feedback:", mcp);
          dispatch(stream(mcp.delta?.content))
          if (currentIntent) {
            //console.log("[useAgentSocket] MCP feedback:", mcp.delta.content);

            setFeedbackData((prev) => {
              const currentList = prev[currentIntent] || [];
              let newContent = [];
              if (mcp.delta?.content) {
                newContent = [mcp.delta.content];
              } else if (mcp.messages?.length > 0) {
                newContent = mcp.messages
                  .filter((m) => m.content)
                  .map((m) => m.content);
              }
              return {
                ...prev,
                [currentIntent]: [...currentList, ...newContent],
              };
            });
          } else {
            console.warn("[useAgentSocket] Intent belirlenmeden feedback alındı:", mcp);
          }
        } else if (eventType === "agent-update-title") {
          console.log("[useAgentSocket] Yeni konuşma başlığı:", data.title);
          dispatch(setConversationTitle(data));
        } else if (eventType === "error") {
          console.error("[useAgentSocket] Sunucu hatası:", data.message);
          if (data.message.includes("token")) {
            console.log("[useAgentSocket] Token hatası, yenileniyor...");
            refreshToken().then(() => connectSocket()).catch(() => {
              console.error("[useAgentSocket] Yeniden bağlantı başarısız");
            });
          }
        } else {
          console.warn("[useAgentSocket] Bilinmeyen event tipi:", eventType);
        }
      } catch (error) {
        console.error("[useAgentSocket] Mesaj parse hatası:", error, "Ham veri:", event.data);
      }
    };

    socket.onclose = (event) => {
      console.log("[useAgentSocket] WebSocket bağlantısı kapandı:", {
        code: event.code,
        reason: event.reason,
      });
      if (event.code === 1008) {
        console.log("[useAgentSocket] Token geçersiz, yenileniyor...");
        refreshToken()
          .then(() => {
            reconnectAttempts.current = 0;
            connectSocket();
          })
          .catch(() => {
            console.error("[useAgentSocket] Token yenileme başarısız");
            if (reconnectAttempts.current < maxReconnectAttempts) {
              setTimeout(() => {
                console.log("[useAgentSocket] Yeniden bağlanıyor... Deneme:", reconnectAttempts.current + 1);
                reconnectAttempts.current += 1;
                connectSocket();
              }, reconnectInterval);
            }
          });
      } else if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          console.log("[useAgentSocket] Yeniden bağlanıyor... Deneme:", reconnectAttempts.current + 1);
          reconnectAttempts.current += 1;
          connectSocket();
        }, reconnectInterval);
      } else {
        console.error("[useAgentSocket] Maksimum yeniden bağlanma denemesi aşıldı");
      }
    };

    socket.onerror = (error) => {
      console.error("[useAgentSocket] WebSocket hatası:", error);
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