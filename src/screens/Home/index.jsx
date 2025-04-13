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

import { DETAILVIEW } from "../../constant/chatContentConstant";
import useChat from "./useChat";
import useAgentSocket from "../../hooks/useAgentSocket";
export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connectSocket } = useAgentSocket()
  const { id: conversationParamId } = useParams();
  const { isLogin } = useAuth();
  const [t] = useTranslation("global");


  // Local UI durumları
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [openChatMessage, setOpenChatMessage] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chatInputPosition, setChatInputPosition] = useState("middle");
  const [isOpenFavorite, setOpenFavorite] = useState(false);
  // Eğer gerekiyorsa loading durumunu ayrı tutabilirsin veya hook içinden alabilirsin
  const [conversationLoading, setConversationLoading] = useState(false);

  useEffect(() => {
    console.log("isLogin", isLogin)
    if (isLogin) connectSocket()
  }, [isLogin])

  /* 
    useChat hook'una iki tane callback (uiActions) gönderiyoruz:
    - onProductSelected: Ürün seçildiğinde UI'da ürün detayını açmak ve chat input pozisyonunu ayarlamak için.
    - onPromptStart: Yeni mesaj (prompt) gönderilmeden önce gerekli UI güncellemelerini tetiklemek için.
    
    İkinci parametre olarak conversationParamId veriyoruz; bu sayede, eğer URL'de bir conversation id varsa, hook ilgili detayları getiriyor.
  */
  const {
    groupedMessages,
    systemMessage,
    totalCount,
    currentPage,
    viewAction,
    selectedProduct,
    setSystemMessage,
    sendMessage,
    handleSetConversation,
    conversationid,
    updateMessageBlock,
    handleViewAction,
    changePage,
    setConversationid,
  } = useChat(

    {
      onUpdateMessageBlock: () => {
        setOpenChatMessage(true)
      },
      onUpdateActionView: (viewAction) => {

      },
      onProductSelected: () => {
        console.log("onProductSelected: Ürün seçildi.");
        setOpenProductDetail(true);
        setChatInputPosition("left-middel");
      },
      onPromptStart: () => {
        setOpenProductDetail(false);
        setOpenChatMessage(true);
        setChatInputPosition("bottom");
        // Sayfalama resetleme gibi işlemler de burada tetiklenebilir
      },
    },
    conversationParamId
  );

  // Log when Home component mounts
  useEffect(() => {
    console.log("Home component mounted.");
  }, []);



  // groupedMessages değiştiğinde güncel sayfa verisini (systemMessage) ayarla
  useEffect(() => {
    const pages = Object.keys(groupedMessages);
    console.log("Grouped messages keys:", pages);
    if (pages.length > 0) {
      // currentPage, sayfa numarasını 1 bazlı tuttuğumuzdan, dizideki indeksi currentPage - 1 olarak seçiyoruz
      const currentMessages = groupedMessages[pages[currentPage - 1]] || [];
      console.log(`Setting system message for page ${currentPage}:`, currentMessages);
      setSystemMessage(currentMessages);
    }
  }, [groupedMessages, currentPage]);

  // Eğer URL'den bir conversation id geldi ise ilgili işlemleri yap
  useEffect(() => {
    console.log("URL parameter conversationParamId:", conversationParamId);
    if (conversationParamId) {
      setConversationid(conversationParamId);
      setOpenSidebar(false);
      setChatInputPosition("bottom");
      console.log("Conversation id set from URL:", conversationParamId);
    }
  }, [conversationParamId, setConversationid]);

  /* 
    Bu useEffect içerisinde, örneğin Redux üzerinden gelen yeni mesaj (system_message) varsa,
    updateMessageBlock fonksiyonu ile mesaj bloğunu güncelliyoruz. 
    Eğer isLoading ve isSuccess gibi durumları ek olarak kontrol etmek isterseniz,
    hook içindeki yönetimi veya Redux state'lerini de kullanabilirsiniz.
  */
  useEffect(() => {
    // Bu örnekte hook içindeki mesaj güncellemeleri otomatik yapılıyor.
    // Eğer ek bir kontrol gerekiyorsa, burada düzenlemeler yapabilirsiniz.
  }, [/* system_message gibi ek bağımlılıklar */]);

  // Yeni konuşma oluşturulduğunda yönlendirme
  useEffect(() => {
    // Eğer conversation oluşturulmuşsa yönlendirme yapıyoruz.
    if (conversationid) {
      navigate("/conversation/" + conversationid);
    }
  }, [conversationid, navigate]);

  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

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
                  messages={systemMessage}
                  viewAction={viewAction}
                  isLoading={conversationLoading}
                  actionState={() => setOpenProductDetail((prev) => !prev)}
                />
              </div>
              <div className={`detail-blok ${openProductDetail ? "" : "hidden"}`}>
                <ProductDetail
                  product={selectedProduct}
                  closeDetail={() => {
                    setOpenProductDetail(false);
                    setChatInputPosition("middle");
                    handleViewAction();
                  }}
                  openDetail={() => {
                    setOpenProductDetail((prev) => !prev);
                    setChatInputPosition("middle");
                    handleViewAction();
                  }}
                />
              </div>
            </div>
          </div>
          <Favorite
            isOpenFavorite={isOpenFavorite}
            closeFavoriteSection={() => setOpenFavorite(false)}
          />
        </div>
        {isLogin && <ChatInput position={chatInputPosition} sendMessage={sendMessage} />}
      </div>
    </>
  );
}