import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../layouts/Header'
import Sidebar from '../../layouts/Sidebar'
import Chat from "../../components/Chat"
import Paginations from '../../components/Paginations'
import ProductDetail from '../../components/ProductDetail'
import Favorite from '../../layouts/Favorite'
import ChatInput from "../../layouts/Input"
import { createconversation, conversation, resetConversation, conversationHistory, conversationDetail } from "../../api/conversation/conversationSlicer"


export default function Home() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id: conversationid } = useParams();

  //ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const { isLogin } = useAuth()
  const [t, i18n] = useTranslation("global")
  const [openProductDetail, setOpenProductDetail] = useState(false)
  const [openChatMessage, setOpenChatMessage] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(true)
  const [chatInputPosition, setChatInputPosition] = useState("middle")
  const [HumanMessage, setHumanMessage] = useState(null)
  const [systemMessage, setSystemMessage] = useState([])
  const [groupedMessages, setGroupedMessages] = useState({});


  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const openDetailSidebar = () => {
    setOpenProductDetail(!openProductDetail)
  }
  const { data, isSuccess, isError, isLoading, system_message, conversationid: createdConversationid, detail } = useSelector(
    (state) => {
      return state.conversation
    }
  )
  // Konuşma ID varsa geçmişi yükle
  useEffect(() => {
    dispatch(conversationHistory())
    if (conversationid) {
      if (conversationid != undefined) {
        setOpenSidebar(false)
        setChatInputPosition("bottom")
        dispatch(conversationDetail({ conversationid: conversationid }))
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        if (detail != null) {

          setMessageBlok(detail)
          console.log("total page", totalCount)
        }
      }
    }
  }, [isSuccess, isError, isLoading, detail])

  const setMessageBlok = (message) => {
    const groupedMessages = groupMessagesByGroupId(message.messages);
    console.log("groupedMessages", groupedMessages)
    setGroupedMessages(groupedMessages);
    setTotalCount(Object.keys(groupedMessages).length);
    setSystemMessage(groupedMessages[Object.keys(groupedMessages)[currentPage - 1]] || []);
    setOpenChatMessage(true)
  }
  const groupMessagesByGroupId = (messages) => {
    return messages.reduce((groups, message) => {
      const group = groups[message.groupid] || [];
      group.push(message);
      groups[message.groupid] = group;
      return groups;
    }, {});
  };

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        if (system_message != null) {
          setCurrentPage(currentPage + 1)
          setMessageBlok(system_message)
        }
      }
    }
  }, [isSuccess, isError, isLoading, system_message, currentPage])

  useEffect(() => {
    console.log("isSuccess, isError, isLoading, conversationid", isSuccess, isError, isLoading, conversationid)
    if (!isLoading) {
      if (isSuccess) {
        if (conversationid) {
          //dispatch(conversation({ conversationid, human_message: HumanMessage }))
        } else {
          if (createdConversationid != null) {
            if (HumanMessage != null) {
              navigate("/conversation" + "/" + createdConversationid)
              dispatch(conversation({ conversationid, human_message: HumanMessage }))
              setOpenChatMessage(true)
            }
          }
        }
      }
    }
  }, [isSuccess, isError, isLoading, createdConversationid])


  const [isOpenFavorite, setOpenFavoite] = useState(false)

  const newconversation = () => {
    setChatInputPosition("middle")
    dispatch(resetConversation())
    dispatch(createconversation())
    setOpenChatMessage(false)
    setOpenProductDetail(false)
    setSystemMessage([])



  }
  const closeFavoriteSection = () => {
    setOpenFavoite(false)
  }

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }
  const sendPromt = (human_message) => {
    setHumanMessage(human_message)
    setOpenSidebar(false)
    setChatInputPosition("bottom")
    if (conversationid != null) {
      if (conversationid != undefined) {
        dispatch(conversation({ conversationid, human_message }))
      }
    } else {
      dispatch(createconversation())
    }
  }



  const changePage = (page) => {
    setCurrentPage(page);
    setSystemMessage(groupedMessages[Object.keys(groupedMessages)[page - 1]] || []);
  };

  return (
    <>
      {isLogin ? <Sidebar startNewconversation={newconversation} openSidebar={openSidebar} /> : <></>}
      <div className="content">
        {isLogin ? <Header toggleSidebar={toggleSidebar} /> : <></>}
        {isLogin && totalCount != 0 ? <Paginations totalCount={totalCount} currentPage={currentPage} changePage={changePage} /> : <></>}
        <div className="chat-section">
          <div className={`chat-container ${isOpenFavorite ? 'open-favorite' : ''}`}>
            <div className="chat-blok">
              <div className={`message-blok ${openChatMessage ? '' : 'hidden'}`}><Chat response={systemMessage} openDetail={openDetailSidebar} /></div>
              <div className={`detail-blok ${openProductDetail ? '' : 'hidden'}`}><ProductDetail openDetail={openDetailSidebar} />
              </div>
            </div>
          </div>
          <Favorite isOpenFavorite={isOpenFavorite} closeFavoriteSection={closeFavoriteSection} />
        </div>

        {isLogin ? <ChatInput position={chatInputPosition} sendPromt={sendPromt} /> : <></>}
      </div>
    </>
  )


}