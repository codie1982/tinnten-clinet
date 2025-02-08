import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
//Components


import { useAuth } from '../../context/authContext';
export default function MainLayout() {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")
   
    return (

        <div data-bs-spy="scroll" data-bs-target="#navbar-example" >
            <Container fluid className="main-container">
                <Outlet lang={global} />
            </Container>
        </div>

    )
}

