import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
//Components
import { useAuth } from '../../context/authContext';
import HeaderNoAuth from "layouts/HeaderNoAuth";
import FooterNoAuth from "layouts/FooterNoAuth";
export default function MainLayout() {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")
    const { isLogin, isLoading, user } = useAuth();

    if (isLoading) {
        return <>Yükleniyor...</>
    }

    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example" >
            <Container fluid className={`page-container `}>
                <div className={`page-content ${!isLogin && user != null && user.email_verified ? "page-vertical" : "page-horizontal"}`}>
                    {!isLogin && user != null && user.email_verified ?
                        <HeaderNoAuth /> : <></>}
                    <Outlet lang={global} />
                    {!isLogin && user != null && user.email_verified ? <FooterNoAuth /> : <></>}
                </div>
            </Container>
        </div>
    )
}