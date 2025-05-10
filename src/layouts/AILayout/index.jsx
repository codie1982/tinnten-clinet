import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom";
import { Link, useNavigate, } from "react-router-dom";

//Components
import { useAuth } from '../../context/authContext';
import Header from "layouts/Header";
import Sidebar from "../../layouts/Sidebar";
export default function AILayout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [t, i18n] = useTranslation("global")
    const { isLogin, isLoading, user } = useAuth();
    const [openSidebar, setOpenSidebar] = useState(true);

    if (isLoading) {
        return <>Yükleniyor...</>
    }
    //if (isLogin) navigate("/conversation")
    const toggleSidebar = () => setOpenSidebar((prev) => !prev);
    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example" >
            <Container fluid className={`page-container `}>
                <div className={`page-content page-horizontal`}>
                    <>
                        {isLogin && <Sidebar openSidebar={openSidebar} />}
                        <div className="content">
                            {isLogin && <Header toggleSidebar={toggleSidebar} />}
                            <Outlet lang={global} />
                        </div>
                    </>
                </div>
            </Container>
        </div>
    )
}