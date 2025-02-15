import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../layouts/Header'
import Sidebar from '../../layouts/Sidebar'
import Chat from "../../components/Chat"
import ProductDetail from '../../components/ProductDetail'
import Favorite from '../../layouts/Favorite'
import ChatInput from "../../layouts/Input"
import { createconversation, chat, resetConversation,conversationHistory } from "../../api/conversation/conversationSlicer"
import { faL } from '@fortawesome/free-solid-svg-icons'

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
  const [userPromt, setUserPromt] = useState("")
  const [systemMessage, setSystemMessage] = useState([])

  const openDetailSidebar = () => {
    setOpenProductDetail(!openProductDetail)
  }
  const { data, isSuccess, isError, isLoading, system_message } = useSelector(
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
        dispatch(chat({ id: conversationid, promt:"" }))
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading)
      if (isSuccess) {
        if (data?.conversationid != null) {
          navigate(`/conversation/${data?.conversationid}`);
        }
      }
  }, [data, isSuccess, isError, isLoading, system_message])


  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        if (system_message != null) {
          setOpenChatMessage(true)
          setSystemMessage(system_message)

        }
      }
    }
  }, [isSuccess, isError, isLoading, system_message])


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
  const sendPromt = (promt) => {
    setUserPromt(promt)
    setOpenSidebar(false)
    setChatInputPosition("bottom")
    if (conversationid != null) {
      if (conversationid != undefined) {
        dispatch(chat({ id: conversationid, promt }))
      }
    }

  }

  return (
    <>
      {isLogin ? <Sidebar startNewconversation={newconversation} openSidebar={openSidebar} /> : <></>}
      <div className="content">
        {isLogin ? <Header toggleSidebar={toggleSidebar} /> : <></>}
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