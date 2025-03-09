import React from 'react'
import { Link, useNavigate, } from "react-router-dom";
import logo from '../../assets/char-logo.png'
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'
import socialX from "../../assets/X_icon.png"
import socialIntagram from "../../assets/instagram_icon.png"
import socialFacebook from "../../assets/facebook_icon.png"
export default function FooterNoAuth() {
    return (
        <footer className="site-footer">
            <Row className="footer-container">
                <Col className="footer-links-col">
                    <div className="footer-links">
                        <Link to="/abouth">Hakkında</Link>
                        <Link to="/consumer-terms">Gizlilik Politikası</Link>
                        <Link to="/privatepolicy">Kullanım Şartları</Link>
                        <Link to="/contact">Destek</Link>
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
                    <p className="copyright">&copy; 2025 Tinnten AI - Tüm Hakları Saklıdır.</p>
                </Col>
            </Row>
        </footer>
    )
}
