import React from 'react'
import { Link, useNavigate, } from "react-router-dom";
import logo from '../../assets/char-logo.png'
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'
import socialX from "../../assets/X_icon.png"
import socialIntagram from "../../assets/instagram_icon.png"
import socialFacebook from "../../assets/facebook_icon.png"
import { useTranslation } from "react-i18next"

export default function FooterNoAuth() {
    const [t, i18n] = useTranslation("global")
    return (
        <footer className="site-footer">
            <Row className="footer-container">
                <Col className="footer-links-col">
                    <div className="footer-links">
                        <Link to="/abouth">{t("footerNoAuth.menu.abouth")}</Link>
                        <Link to="/consumer-terms">{t("footerNoAuth.menu.privatepolicy")}</Link>
                        <Link to="/privatepolicy">{t("footerNoAuth.menu.terms")}</Link>
                        <Link to="/contact">{t("footerNoAuth.menu.support")}</Link>
                    </div>
                </Col>
                <Col className="social-icons-col">
                    <div className="social-icons">
                        <Link to="https://x.com"><img src={socialX} alt="x account icon" /></Link>
                        <Link to="https://www.instagram.com"><img src={socialIntagram} alt="instagram account icon" /></Link>
                        <Link to="https://www.facebook.com"><img src={socialFacebook} alt="facebook account icon" /></Link>
                    </div>
                </Col>
                <Col className="footer-copy-col">
                    <p className="copyright">&copy; {t("footerNoAuth.copyright.text")}</p>
                </Col>
            </Row>
        </footer>
    )
}
