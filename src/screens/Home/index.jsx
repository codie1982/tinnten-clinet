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

import useChatManager from "./useChatManager";
import useConversationFlow from "./useConversationFlow";

import {
  createconversation,
  conversation,
  resetConversation,
  conversationHistory,
  conversationDetail,
} from "../../api/conversation/conversationSlicer";
import AgentFeedbackViewer from '../../components/AgentFeedbackViewer';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: conversationParamId } = useParams();
  const { isLogin } = useAuth();
  const [t] = useTranslation("global");

  // Local state
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [openChatMessage, setOpenChatMessage] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chatInputPosition, setChatInputPosition] = useState("middle");
  const [humanMessage, setHumanMessage] = useState(null);

  const [isOpenFavorite, setOpenFavorite] = useState(false);
  const {
    groupedMessages,
    systemMessage,
    totalCount,
    currentPage,
    updateMessageBlock,
    setSystemMessage,
    setTotalCount,
    changePage,
  } = useChatManager();

  const {
    sendPrompt,
    handleSetConversation,
    conversationid,
    setConversationid,
  } = useConversationFlow(updateMessageBlock, conversationParamId);

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



  useEffect(() => {
    const pages = Object.keys(groupedMessages);
    setSystemMessage(groupedMessages[pages[currentPage - 1]] || []);
  }, [groupedMessages, currentPage])




  // İlk yükleme: Eğer conversationid varsa sadece detayını al, yoksa geçmişi getir
  useEffect(() => {
    if (conversationParamId) {
      setConversationid(conversationParamId);
      setOpenSidebar(false);
      setChatInputPosition("bottom");
    }
  }, [conversationParamId]);


  // Eğer yeni bir mesaj varsa ve konuşma devam ediyorsa mesajları güncelle
  useEffect(() => {
    if (!isLoading && isSuccess && system_message) {
      console.log("system_message", system_message)
      setOpenChatMessage(true);
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

  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  return (
    <>
      {isLogin && (
        <Sidebar setConversation={handleSetConversation} openSidebar={openSidebar} />
      )}
     
      <div className="content">
      <AgentFeedbackViewer />
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
                  isLoading={isLoading} // 💡 Burada ekliyoruz
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