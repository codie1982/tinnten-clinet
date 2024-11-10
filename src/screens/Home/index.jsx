import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, } from "react-router-dom";
import { Row, Col, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ReactGA from "react-ga4";
import { useCookies } from 'react-cookie';
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
export default function Home() {
  ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const { isLoading, isLogin, user, logout } = useAuth()
  const [cookies, setCookie] = useCookies(['name']);
  const [t, i18n] = useTranslation("global")

  return (
     <section className="d-flex align-items-center justify-content-center min-vh-100">
       <div className="middel-section">
        <div className="">
          <h1>Welcome to the Home Page</h1>
        </div>
        <div className="">
          <input type="text" placeholder="Search" />
        </div>
       </div>
     </section>
  )
}