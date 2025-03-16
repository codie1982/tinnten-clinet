import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";
import Header from "../../layouts/Header";
import Sidebar from "../../layouts/Sidebar";
import Chat from "../../components/Chat";
import Paginations from "../../components/Paginations";
import ProductDetail from "../../components/ProductDetail";
import Favorite from "../../layouts/Favorite";
import ChatInput from "../../layouts/Input";
import {
  createconversation,
  conversation,
  resetConversation,
  conversationHistory,
  conversationDetail,
} from "../../api/conversation/conversationSlicer";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: conversationparamid } = useParams();
  const { isLogin } = useAuth();
  const [t] = useTranslation("global");

  // Local state
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [openChatMessage, setOpenChatMessage] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chatInputPosition, setChatInputPosition] = useState("middle");
  const [humanMessage, setHumanMessage] = useState(null);
  const [systemMessage, setSystemMessage] = useState(null);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenFavorite, setOpenFavorite] = useState(false);
  const [conversationid, setConversationid] = useState(null)

  // Redux state
  const { isSuccess, isLoading, system_message, detail, conversationid: selectedConversationid, conversationCreated } = useSelector(
    (state) => state.conversation
  );

  // Helper: Group messages by group id
  const groupMessagesByGroupId = (messages = []) => {
    console.log("messages.length", messages.length);

    if (messages.length === 0) {
        return {};
    }

    return messages.reduce((groups, message) => {
        if (!groups[message.groupid]) {
            groups[message.groupid] = [];
        }
        groups[message.groupid].push(message);
        return groups;
    }, {});
};


  // Update message block based on new messages
  const updateMessageBlock = useCallback(
    (message) => {
      if (message.length != 0) {
        const grouped = groupMessagesByGroupId(message);
        console.log("grouped", grouped)
        setGroupedMessages(grouped);
        console.log("Object.keys(grouped)", Object.keys(grouped))
        const pages = Object.keys(grouped);
        const lastPage = pages.length; // Son sayfa sayısını belirle

        console.log("lastPage", lastPage)
        setTotalCount(lastPage);
        setCurrentPage(lastPage); // Sayfayı her zaman son sayfaya ayarla

        setOpenChatMessage(true);
        setOpenSidebar(false);
        setChatInputPosition("bottom");
      }
    }
    , []
  );
  useEffect(() => {
    const pages = Object.keys(groupedMessages);
    setSystemMessage(groupedMessages[pages[currentPage - 1]] || []);
  }, [groupedMessages])


  useEffect(() => {
    dispatch(conversationHistory());
  }, [])

  // İlk yükleme: Eğer conversationid varsa sadece detayını al, yoksa geçmişi getir
  useEffect(() => {
    if (conversationparamid) {
      console.log("conversationparamid", conversationparamid)
      setConversationid(conversationparamid)
      setOpenSidebar(false);
      setChatInputPosition("bottom");
      dispatch(conversationDetail({ conversationid: conversationparamid }));
    }
  }, [dispatch, conversationparamid]);

  // Detaylar güncellendiğinde mesaj bloğunu güncelle
  /*   useEffect(() => {
      if (!isLoading && isSuccess && detail) {
        updateMessageBlock(detail.messages);
      }
    }, [isLoading, isSuccess, detail]); */

  // Eğer yeni bir mesaj varsa ve konuşma devam ediyorsa mesajları güncelle
  useEffect(() => {
    if (!isLoading && isSuccess && system_message) {
      console.log("system_message", system_message)
      updateMessageBlock(system_message.messages || []);
    }
  }, [isLoading, isSuccess, system_message]);


  useEffect(() => {
    if (!isLoading && isSuccess && conversationCreated) {
      if (selectedConversationid != undefined && selectedConversationid) {
        setConversationid(selectedConversationid)
        setChatInputPosition("middle");
        setOpenSidebar(true);
        setOpenChatMessage(false);
        setOpenProductDetail(false);
        setTotalCount(0);
        setSystemMessage(null);
        navigate("/conversation" + "/" + selectedConversationid)
      }
    }
  }, [isLoading, isSuccess, selectedConversationid, conversationCreated])




  // Handlers
  const handleSetConversation = (convId) => {

    if (convId) {
      setOpenSidebar(false);
      setOpenChatMessage(true);
      setChatInputPosition("bottom");
      dispatch(conversationDetail({ conversationid: convId }));
    } else {
      console.log("convId", convId)
      setChatInputPosition("middle");
      dispatch(resetConversation());
      dispatch(createconversation());
      setOpenChatMessage(false);
      setOpenProductDetail(false);
      setTotalCount(0);
      setSystemMessage(null);
    }
  };

  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  const sendPrompt = (message) => {
    setHumanMessage(message);
    setOpenSidebar(false);
    setOpenChatMessage(true);
    setChatInputPosition("bottom");
    console.log("{ conversationid, human_message: message }", { conversationid, human_message: message })
    if (conversationid) {
      dispatch(conversation({ conversationid, human_message: message }));
    } else {
      dispatch(createconversation());
    }
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalCount) {
      setCurrentPage(page);
      const pages = Object.keys(groupedMessages);
      setSystemMessage(groupedMessages[pages[page - 1]] || []);
    }
  };

  return (
    <>
      {isLogin && (
        <Sidebar setConversation={handleSetConversation} openSidebar={openSidebar} />
      )}
      <div className="content">
        {isLogin && <Header toggleSidebar={toggleSidebar} />}
        {isLogin && totalCount !== 0 && (
          <Paginations
            totalCount={totalCount}
            currentPage={currentPage}
            changePage={changePage}
          />
        )}
        <div className="chat-section">
          <div className={`chat-container ${isOpenFavorite ? "open-favorite" : ""}`}>
            <div className="chat-blok">
              <div className={`message-blok ${openChatMessage ? "" : "hidden"}`}>
                <Chat
                  response={systemMessage}
                  openDetail={() => setOpenProductDetail((prev) => !prev)}
                />
              </div>
              <div className={`detail-blok ${openProductDetail ? "" : "hidden"}`}>
                <ProductDetail openDetail={() => setOpenProductDetail((prev) => !prev)} />
              </div>
            </div>
          </div>
          <Favorite
            isOpenFavorite={isOpenFavorite}
            closeFavoriteSection={() => setOpenFavorite(false)}
          />
        </div>
        {isLogin && <ChatInput position={chatInputPosition} sendPromt={sendPrompt} />}
      </div>
    </>
  );
}