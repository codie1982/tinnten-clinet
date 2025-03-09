import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login, register } from "../../api/auth/authSlicer"
import { Link, useNavigate, } from "react-router-dom";
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'

import LoginForm from "../LoginForm"
import RegisterForm from "../RegisterForm"
import MailVerifyForm from "../MailVerifyForm"
import ForgotPasswordFrom from "../ForgotPasswordFrom"
import { LOGIN, REGISTER, MAILVERIFY, GOOGLE, FORGOTPASSWORD } from '../../constant'
import demo from "../../assets/assets-one.gif"


import ProductCard from '../Chat/ProductCard'
import HeaderNoAuth from 'layouts/HeaderNoAuth';


export default function Advertaise() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [form, setForm] = useState(LOGIN)
    const [isSendCode, setIsSendCode] = useState(false)

    const { isLoading } = useSelector(
        (state) => {
            return state.auth
        }
    )


    const [formValidation, setFormValidation] = useState({
        login: {
            email: {
                error: false, message: ""
            },
            password: {
                error: false, message: ""
            }
        },
        register: {
            email: {
                error: false, message: ""
            },
            password: {
                error: false, message: ""
            },
            rePassword: {
                error: true, message: ""
            }
        },
        forgotPassword: {
            email: {
                error: false, message: ""
            },
        },
        mailVerify: {
            email: {
                error: false, message: ""
            },
        }
    })




    const resetValidation = () => {
        setFormValidation({
            login: {
                email: {
                    error: false, message: ""
                },
                password: {
                    error: false, message: ""
                }
            },
            register: {
                email: {
                    error: false, message: ""
                },
                password: {
                    error: false, message: ""
                },
                rePassword: {
                    error: true, message: ""
                }
            },
            forgotPassword: {
                email: {
                    error: false, message: ""
                },
            },
            mailVerify: {
                email: {
                    error: false, message: ""
                },
            }
        })
    }
    const setStateForm = (state) => {
        setForm(state)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        resetValidation()
        setIsSendCode(true)
        switch (form) {
            case LOGIN:
                const loginemail = e.target.email.value;
                const loginpassword = e.target.password.value;

                if (loginemail === "") {
                    setFormValidation(prev => ({
                        ...prev,
                        login: {
                            ...prev.login,
                            email: { error: true, message: "Email alanı boş olamaz." }
                        }
                    }));
                }
                if (loginpassword === "") {
                    setFormValidation(prev => ({
                        ...prev,
                        login: {
                            ...prev.login,
                            password: { error: true, message: "Şifre alanı boş olamaz." }
                        }
                    }));
                }
                if (loginemail !== "" && loginpassword !== "") {
                    dispatch(login({
                        email: loginemail, password: loginpassword, "device": "web",
                    }))
                }

                return;
            case REGISTER:
                const registeremail = e.target.email.value;
                const registerpassword = e.target.password.value;
                const registerrepassword = e.target.password.value;

                if (registerpassword == registerrepassword) {

                }
                dispatch(register({
                    email: registeremail, password: registerpassword, repassword: registerrepassword
                }))
                return;
            case FORGOTPASSWORD:
                const forgotemail = e.target.email.value;

                console.log("Kullanıcı Email:", forgotemail);
                return;
            case GOOGLE:
                return;
            default:
                return null; // Hiçbir durumda render edilmezse
        }
    }

    const renderForm = () => {
        switch (form) {
            case LOGIN:
                return <LoginForm setState={setStateForm} handleLoginSubmit={handleSubmit} validation={formValidation.login} reset={resetValidation} isLoading={isLoading} />;
            case REGISTER:
                return <RegisterForm setState={setStateForm} handleRegisterSubmit={handleSubmit} validation={formValidation.register} isSendCode={isSendCode} />;
            case MAILVERIFY:
                return <MailVerifyForm setState={setStateForm} validation={formValidation.mailVerify} />;
            case FORGOTPASSWORD:
                return <ForgotPasswordFrom setState={setStateForm} validation={formValidation.forgotPassword} />;
            default:
                return null; // Hiçbir durumda render edilmezse
        }
    };

    return (
        <>
            <div className="page-inside page-fluid page-no-border page-no-background">
                <Row className="chat-advertise-row">
                    <Col className="chat-advertise-col left-side">
                        <main className="hero-section">
                            <Row>
                                <Col>
                                    <h1 className="hero-title">Yapay Zeka Destekli Ürün Keşfi</h1>
                                    <p className="hero-description">İhtiyacınız olan ürünü hızlı ve kolayca bulun, gereksiz detaylarla vakit kaybetmeyin.</p>
                                    <a href="signup.html" className="btn btn-lg cta-button">Keşfetmeye Başla</a>
                                </Col>
                                {/* <Col>

                                    <Carousel data-bs-theme="dark">
                                        <Carousel.Item>

                                            <Card className="product-card" key={""}>
                                                <div className="product-image-container">
                                                    <Card.Img variant="bottom" src={logo} alt={"product.description"} />
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
                                                    <Card.Img variant="bottom" src={logo} alt={"product.description"} />
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

                                    </Carousel>
                                    <ul>
                                        <li>

                                        </li>
                                    </ul>
                                </Col> */}
                            </Row>

                        </main>
                        <div className="chat-advertise-text-content">
                            <h2 className="display-4 mb-4 text-left">Akıllı ve Hedefe Odaklı</h2>
                            <h3 className="display-5 mb-2 text-left">Sadece İlgilendiğiniz Ürünleri Görün</h3>
                            <p className="lead text-left">Karmaşaya girmeden, sadece ilgilendiğiniz ürün gruplarına odaklanın. Tinnten AI, ihtiyacınıza uygun seçenekleri analiz ederek, en doğru ve alakalı sonuçları sizin için sıralar.</p>
                        </div>
                    </Col>
                </Row>
                <section className="supporting-section">
                    <div className="supporting-section-one">
                        <h2 className="supporting-title">Tinnten AI Nasıl Çalışır?</h2>
                        <p className="supporting-description">Üç basit adımda ihtiyacınız olan ürünü hızla keşfedin..</p>
                    </div>
                    <div className="supporting-section-two">
                        <div className="features-grid">
                            <div className="feature-item">
                                <h3 className="feature-title">Aramanızı Yapın</h3>
                                <p className="feature-description">Basit bir cümle ile ihtiyacınızı tanımlayın. Yapay zeka, aramanızın bağlamını anlar.</p>
                            </div>

                            <div className="feature-item">
                                <h3 className="feature-title">AI Analiz Etsin</h3>
                                <p className="feature-description">Tinnten AI, en iyi eşleşmeleri belirleyerek size en uygun ürünleri sunar.</p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-title">Net Seçimler</h3>
                                <p className="feature-description">Sadece ilgilendiğiniz ürünleri görün, karar vermeyi hızlandırın.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="statistics-section">
                    <div className="business-registration">
                        <h2 className="business-title">Firmanızı Tinnten AI'ye Ekleyin</h2>
                        <p className="business-description">Tinnten AI ile işletmenizi dijital dünyaya taşıyın. Ürünlerinizi ve hizmetlerinizi ekleyin. Müşterileriniz ile TINNTEN AI sizin adınıza konuşsun .</p>
                    </div>
                    <div className="statistics-section-action">
                        <a href="business-signup.html" className="business-signup-btn">
                            <div className="btn btn-register-action">İşletme Kaydı Oluştur</div>
                        </a>

                    </div>
                </section>
                <section className="faq-section">
                    <h2 className="faq-title">Sıkça Sorulan Sorular</h2>
                    <div className="faq-content">
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Tinnten AI nedir?</Accordion.Header>
                                <Accordion.Body>
                                    Tinnten AI, yapay zeka destekli ürün ve hizmet keşif platformudur. Kullanıcılar, doğal dil ile arama yaparak en uygun ürünlere ve hizmetlere kolayca ulaşabilirler.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Tinnten AI ücretsiz mi?</Accordion.Header>
                                <Accordion.Body>
                                    Evet, Tinnten AI'nin temel sürümünü ücretsiz kullanabilirsiniz. Ancak, işletmeler için gelişmiş özellikler sunan premium planlar da mevcuttur.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Tinnten AI hangi kategorilerde hizmet veriyor?</Accordion.Header>
                                <Accordion.Body>
                                    Elektronik, moda, mobilya, sağlık, hizmet sektörü gibi birçok alanda ürün ve hizmet keşfi yapabilirsiniz.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>İşletmemi Tinnten AI'ye nasıl ekleyebilirim?</Accordion.Header>
                                <Accordion.Body>
                                    İşletmenizi eklemek için "İşletme Kaydı Oluştur" butonuna tıklayarak ürünlerinizi ve hizmetlerinizi sisteme yükleyebilirsiniz.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>

                </section>
               
            </div>
           
        </>
    )
}