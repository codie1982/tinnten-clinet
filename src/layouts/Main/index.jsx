import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
import { Link, useNavigate, } from "react-router-dom";

//Components
import { useAuth } from '../../context/authContext';
import HeaderNoAuth from "layouts/HeaderNoAuth";
import FooterNoAuth from "layouts/FooterNoAuth";
export default function MainLayout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [t, i18n] = useTranslation("global")
    const { isLogin, isLoading, user } = useAuth();

    if (isLoading) {
        return <>Yükleniyor...</>
    }
    if (isLogin) navigate("/conversation")
    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example" >
            <Container fluid className={`page-container `}>
                <div className={`page-content ${!isLogin ? "page-vertical" : "page-horizontal"}`}>
                    {!isLogin ?
                        <HeaderNoAuth /> : <></>}
                    <Outlet lang={global} />
                    {!isLogin ? <FooterNoAuth /> : <></>}
                </div>
            </Container>
        </div>
    )
}