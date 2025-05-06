import React from 'react'
import { Link, useNavigate, } from "react-router-dom";
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'
import logo from '../../assets/char-logo.png'
import { useTranslation } from "react-i18next"
import OurOfferModal from './../../components/Modals/OurOfferModal';
import { useModal } from '../../components/Modals/ModalProvider';
export default function HeaderNoAuth() {
    const [t, i18n] = useTranslation("global")
        const { openModal } = useModal();
    return (
        <header className="page-noauth-header">
            <div className="page-noauth-logo-container">
                <Link className="page-noauth-main-link" to="/" >
                    <img className="site-logo-mini" src={logo} />
                    <span>{t("appname")}</span>
                </Link>
            </div>
            <nav className="nav-noauth-menu">
                <ul>
                    <li><Link to={"/abouth"}>{t("headerNoAuth.menu.abouth")}</Link></li>
                    <li><Link to={"/works"}>{t("headerNoAuth.menu.works")}</Link></li>

                </ul>
            </nav>
            <div className="auth-buttons">
                <Col><Button onClick={() => { openModal("ourOffer") }} className="" variant='secondary'>Firmanı Ekle</Button></Col>
            </div>
            <OurOfferModal/>
        </header>
    )
}
