import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { useSelector } from 'react-redux'
import Header from '../../layouts/Header'
import Sidebar from '../../layouts/Sidebar'
import Chat from "../../components/Chat"
import ProductDetail from '../../components/ProductDetail'
import Favorite from '../../layouts/Favorite'
import ChatInput from "../../layouts/Input"

export default function Home() {
  //ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const { isLogin, isLoading,logout} = useAuth()

  const [t, i18n] = useTranslation("global")
  const [openProductDetail, setOpenProductDetail] = useState(false)
  const [openChatMessage, setOpenChatMessage] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)
  const [chatInputPosition, setChatInputPosition] = useState("middle")
  const openDetailSidebar = () => {
    setOpenProductDetail(!openProductDetail)
  }

  const [isOpenFavorite, setOpenFavoite] = useState(false)

  const resetAll = () => {
    setChatInputPosition("middle")
  }
  const closeFavoriteSection = () => {
    setOpenFavoite(false)
  }

  if (isLoading) {
    return <>Yükleniyor..</>
  }

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }
  const sendPromtToTinnten = () => {
    setOpenSidebar(false)
    setChatInputPosition("bottom")

  }
  return (
    <>
      {isLogin ? <Sidebar resetAll={resetAll} openSidebar={openSidebar} /> : <></>}
      <div className="content">
        {isLogin ? <Header toggleSidebar={toggleSidebar}  /> : <></>}
        <div className="chat-section">
          <div className={`chat-container ${isOpenFavorite ? 'open-favorite' : ''}`}>
            <div className="chat-blok">
              <div className={`message-blok ${openChatMessage ? '' : 'hidden'}`}><Chat openDetail={openDetailSidebar} /></div>
              <div className={`detail-blok ${openProductDetail ? '' : 'hidden'}`}><ProductDetail openDetail={openDetailSidebar} />
              </div>
            </div>
          </div>
          <Favorite isOpenFavorite={isOpenFavorite} closeFavoriteSection={closeFavoriteSection} />
        </div>
        {isLogin ? <ChatInput position={chatInputPosition} sendPromtToTinnten={sendPromtToTinnten} /> : <></>}
      </div>


    </>
  )


}