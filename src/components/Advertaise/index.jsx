import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login, register } from "../../api/auth/authSlicer"
import { Link, useNavigate, } from "react-router-dom";
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import LoginForm from "../LoginForm"
import RegisterForm from "../RegisterForm"
import MailVerifyForm from "../MailVerifyForm"
import ForgotPasswordFrom from "../ForgotPasswordFrom"
import { LOGIN, REGISTER, MAILVERIFY, GOOGLE, FORGOTPASSWORD } from '../../constant'
import AnimatedText from '../AnimatedText';


export default function Advertaise() {
    const [t, i18n] = useTranslation("global")
    const { isLogin } = useAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoading } = useSelector(
        (state) => {
            return state.auth
        }
    )


    if (isLoading) return <>Yükleniyor</>
    return (
        <>
            <div className="page-inside page-fluid page-no-border page-no-background">
                <Row className="chat-advertise-row">
                    <Col className="chat-advertise-col left-side">
                        <main className="hero-section">
                            <div class="animated-title">
                                <AnimatedText />
                            </div>
                            <Row>
                                <Col>
                                    <h1 className="hero-title">{t("advertaise.hero.title")}</h1>
                                    <p className="hero-description">{t("advertaise.hero.description")}</p>
                                    <Row>
                                        <Col><Link to="/login" className="btn btn-lg btn-block cta-button login">{t("advertaise.hero.login")}</Link></Col>
                                        <Col><Link to="/register" className="btn btn-lg btn-block cta-button register">{t("advertaise.hero.register")}</Link></Col>
                                    </Row>
                                </Col>
                                <Col>

                                    {/*  <Carousel data-bs-theme="dark">
                                        <Carousel.Item>

                                            <Card className="product-card" key={""}>
                                                <div className="product-image-container">
                                                    <Card.Img variant="bottom" src={"logo"} alt={"product.description"} />
                                                </div>
                                                <Card.Body className="product-info">
                                                    <Card.Text>{"product.title"}</Card.Text>
                                                    <Card.Text>{"product.basePrice[0].discountedPrice"}</Card.Text>
                                                    <Card.Text>{""}</Card.Text>
                                                    <Card.Text>Ücretsiz gönderim</Card.Text>
                                                    <div className="button-group">
                                                        <Button variant="info" className="product-detail-button" >Detaylar</Button>
                                                        <Link to={`${"/"}`} variant="primary" className="go-to-product-button">Git</Link>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            <Carousel.Caption>
                                                <h5>First slide label</h5>
                                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <Card className="product-card" key={""}>
                                                <div className="product-image-container">
                                                    <Card.Img variant="bottom" src={"logo"} alt={"product.description"} />
                                                </div>
                                                <Card.Body className="product-info">
                                                    <Card.Text>{"product.title"}</Card.Text>
                                                    <Card.Text>{"product.basePrice[0].discountedPrice"}</Card.Text>
                                                    <Card.Text>{""}</Card.Text>
                                                    <Card.Text>Ücretsiz gönderim</Card.Text>
                                                    <div className="button-group">
                                                        <Button variant="info" className="product-detail-button" >Detaylar</Button>
                                                        <Link to={`${"/"}`} variant="primary" className="go-to-product-button">Git</Link>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            <Carousel.Caption>
                                                <h5>First slide label</h5>
                                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                            </Carousel.Caption>
                                        </Carousel.Item>

                                    </Carousel> */}
                                    <ul>
                                        <li>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>

                        </main>
                        {/*  <div className="chat-advertise-text-content">
                            <h2 className="display-4 mb-4 text-left">{t("advertaise.subhero.title")}</h2>
                            <h3 className="display-5 mb-2 text-left">{t("advertaise.subhero.subtitle")}</h3>
                            <p className="lead text-left">{t("advertaise.subhero.description")}</p>
                        </div> */}
                    </Col>
                </Row>
            </div>
        </>
    )
}


{/*   <section className="supporting-section">
                    <div className="supporting-section-one">
                        <h2 className="supporting-title">{t("advertaise.supporting.title")}</h2>
                        <p className="supporting-description">{t("advertaise.supporting.description")}</p>
                    </div>
                    <div className="supporting-section-two">
                        <div className="features-grid">
                            <div className="feature-item">
                                <h3 className="feature-title">{t("advertaise.feature.one.tilte")}</h3>
                                <p className="feature-description">{t("advertaise.feature.one.description")}</p>
                            </div>

                            <div className="feature-item">
                                <h3 className="feature-title">{t("advertaise.feature.two.title")}</h3>
                                <p className="feature-description">{t("advertaise.feature.two.description")}</p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-title">{t("advertaise.feature.three.title")}</h3>
                                <p className="feature-description">{t("advertaise.feature.three.description")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="statistics-section">
                    <div className="business-registration">
                        <h2 className="business-title">{t("advertaise.business.title")}</h2>
                        <p className="business-description">{t("advertaise.business.description")}</p>
                    </div>
                    <div className="statistics-section-action">
                        <Link to="/register" className="business-signup-btn">
                            <div className="btn btn-register-action">{t("advertaise.business.cta")}</div>
                        </Link>

                    </div>
                </section>
                <section className="faq-section">
                    <h2 className="faq-title">{t("advertaise.faq.title")}</h2>
                    <div className="faq-content">
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>{t("advertaise.faq.one.title")}</Accordion.Header>
                                <Accordion.Body>
                                    {t("advertaise.faq.one.description")}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>{t("advertaise.faq.two.title")}</Accordion.Header>
                                <Accordion.Body>
                                    {t("advertaise.faq.two.description")}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>{t("advertaise.faq.three.title")}</Accordion.Header>
                                <Accordion.Body>
                                    {t("advertaise.faq.three.description")}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>{t("advertaise.faq.four.title")}</Accordion.Header>
                                <Accordion.Body>
                                    {t("advertaise.faq.four.description")}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </section> */}