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


export default function Advertaise() {
    const [t, i18n] = useTranslation("global")

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
                                    <h1 className="hero-title">{t("advertaise.hero.title")}</h1>
                                    <p className="hero-description">{t("advertaise.hero.description")}</p>
                                    <a href="signup.html" className="btn btn-lg cta-button">{t("advertaise.hero.cta")}</a>
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
                            <h2 className="display-4 mb-4 text-left">{t("advertaise.subhero.title")}</h2>
                            <h3 className="display-5 mb-2 text-left">{t("advertaise.subhero.subtitle")}</h3>
                            <p className="lead text-left">{t("advertaise.subhero.description")}</p>
                        </div>
                    </Col>
                </Row>
                <section className="supporting-section">
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
                </section>
            </div>
        </>
    )
}