import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
//Components
import Header from "../Header"
import Sidebar from "../Sidebar"
import Footer from "../Footer"
import ChatInput from '../Input'
import Favorite from "../Favorite";
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../../context/authContext';
export default function AuthLayout() {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")
    const { isLogin } = useAuth();
    const [isOpenFavorite, setOpenFavoite] = useState(false)

    const resetAll = () => {

    }
    const { data } = useSelector(
        (state) => {
            return state.product
        }
    )
    useEffect(() => {
        if (data) {
            setOpenFavoite(!isOpenFavorite)
        }
    }, [data])

    const closeFavoriteSection = () => {
        setOpenFavoite(false)
    }
    return (

            <div data-bs-spy="scroll" data-bs-target="#navbar-example" >
                <Container fluid className="auth-container">
                    <div className="auth-content">
                        <Outlet lang={global} />
                    </div>
                </Container>
            </div>

    )
}