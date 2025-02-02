import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { useSelector } from 'react-redux'
import Header from '../../layouts/Header'
import Chat from "../../components/Chat"
import ProductDetail from '../../components/ProductDetail'
import Advertaise from '../../components/Advertaise'

export default function Home() {
  //ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const { isLogin } = useAuth()
  const [t, i18n] = useTranslation("global")

  const [openProductDetail, setOpenProductDetail] = useState(true)
  const [openChatMessage, setOpenChatMessage] = useState(true)

  const openDetailSidebar = () => {
    setOpenProductDetail(!openProductDetail)
  }

  const { data } = useSelector(
    (state) => {
      return state.product
    }
  )

  useEffect(() => {
    if (data) {
    
    }
  }, [data])
  if (isLogin) {
    return (
      <>
        <div className="chat-blok">
          <div className={`message-blok ${openChatMessage ? '' : 'hidden'}`}><Chat openDetail={openDetailSidebar} /></div>
          <div className={`detail-blok ${openProductDetail ? '' : 'hidden'}`}><ProductDetail openDetail={openDetailSidebar} />
          </div>
        </div>
      </>
    )
  } else {
    return <Advertaise />
  }

}