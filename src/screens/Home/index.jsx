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
import useChat from "../../hooks/useChat";
import useAgentSocket from "../../hooks/useAgentSocket";
export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connectSocket } = useAgentSocket()


  const { isLogin } = useAuth();
  const [t] = useTranslation("global");

  const [viewState, setviewState] = useState("chat")


  // Local UI durumları
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [openChatMessage, setOpenChatMessage] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chatInputPosition, setChatInputPosition] = useState("middle");
  const [isOpenFavorite, setOpenFavorite] = useState(false);
  // Eğer gerekiyorsa loading durumunu ayrı tutabilirsin veya hook içinden alabilirsin
  const [conversationLoading, setConversationLoading] = useState(false);

  const [viewAction, setViewAction] = useState("")
  const [selectedProductid, setSelectedProductid] = useState("")
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
    userIntent,
    selectedProduct,
  } = useChat(
    {
      onUpdateMessageBlock: () => {
        setOpenChatMessage(true)
      },
      onUpdateActionView: () => {

      },
      onProductSelected: (selectedProductid) => {
        console.log("onProductSelected: Ürün seçildi.");
        setOpenProductDetail(true);
        setChatInputPosition("left-middel");
        setSelectedProductid(selectedProductid)
        setViewAction("detail")

      },
      onPromptStart: () => {
        setOpenProductDetail(false);
        setOpenChatMessage(true);
        setChatInputPosition("bottom");
        // Sayfalama resetleme gibi işlemler de burada tetiklenebilir
      },
      onCreateConversationid: (conversationid) => {
        console.log("URL parameter conversationParamId:", conversationid);
        if (conversationid) {
          setOpenSidebar(false);
          setChatInputPosition("bottom");
          console.log("Conversation id set from URL:", conversationid);
        }
        // Sayfalama resetleme gibi işlemler de burada tetiklenebilir
      },
    },
  );

  // Log when Home component mounts
  useEffect(() => {
    console.log("Home component mounted.");
  }, []);

  useEffect(() => {
    console.log("userIntent", userIntent)
    if (userIntent) {
      switch (userIntent) {
        case "chat":
          setOpenChatMessage(true)
          setOpenProductDetail(false);
          setChatInputPosition("bottom");
          break;

        default:
          break;
      }
    }
  }, [userIntent])





  /* 
    Bu useEffect içerisinde, örneğin Redux üzerinden gelen yeni mesaj (system_message) varsa,
    updateMessageBlock fonksiyonu ile mesaj bloğunu güncelliyoruz. 
    Eğer isLoading ve isSuccess gibi durumları ek olarak kontrol etmek isterseniz,
    hook içindeki yönetimi veya Redux state'lerini de kullanabilirsiniz.
  */

  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  return (
    <>
      {isLogin && (
        <Sidebar openSidebar={openSidebar} />
      )}
      <div className="content">
        {isLogin && <Header toggleSidebar={toggleSidebar} />}
        {/*  {isLogin && totalCount !== 0 && (
          <Paginations
            totalCount={totalCount}
            currentPage={currentPage}
            changePage={changePage}
          />
        )} */}
        <div className="chat-section">
          <div className={`chat-container ${isOpenFavorite ? "open-favorite" : ""}`}>
            <div className="chat-blok">
              <div className={`message-blok ${openChatMessage ? "" : "hidden"}`}>
                <Chat
                  intent={userIntent}
                  viewAction={viewAction}
                  isLoading={conversationLoading}
                  actionState={() => setOpenProductDetail((prev) => !prev)}
                />
              </div>
              <div className={`detail-blok ${openProductDetail ? "" : "hidden"}`}>
                <ProductDetail
                  product={selectedProduct}
                  closeDetail={() => {
                    setOpenProductDetail((prev) => !prev)
                    //setChatInputPosition("middle");
                    //handleViewAction();
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
        {isLogin && <ChatInput selectedid={selectedProductid} position={chatInputPosition} />}
      </div>
    </>
  );
}