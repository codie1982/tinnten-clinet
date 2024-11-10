import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
//Components
import Header from "../Header"
import Footer from "../Footer"

import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '../../context/authContext';

export function MainLayout() {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")

    useEffect(() => {
    }, [])


    return (
        <AuthProvider>
            <div data-bs-spy="scroll" data-bs-target="#navbar-example">
                <Container className="section" fluid>
                    <Header />
                    <Outlet lang={global} />
                    {/* <Footer /> */}
                </Container>
            </div>
        </AuthProvider>
    )
}