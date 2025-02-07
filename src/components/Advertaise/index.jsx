import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login,register } from "../../features/auth/authSlicer"
import { useNavigate, } from "react-router-dom";
import { Badge } from 'react-bootstrap'

import LoginForm from "../LoginForm"
import RegisterForm from "../RegisterForm"
import MailVerifyForm from "../MailVerifyForm"
import ForgotPasswordFrom from "../ForgotPasswordFrom"
import { LOGIN, REGISTER, MAILVERIFY, GOOGLE, FORGOTPASSWORD } from '../../constant'
import ProductCard from '../Chat/ProductCard';

export default function Advertaise() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [form, setForm] = useState(LOGIN)
    const [isSendCode, setIsSendCode] = useState(false)
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

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        function simulateNetworkRequest() {
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
        }

        if (isLoading) {

            simulateNetworkRequest().then(() => {
                setLoading(false);

            });

        }
    }, [isLoading]);



    const { data } = useSelector(
        (state) => {
            return state.auth
        }
    )

    useEffect(() => {
        console.log("data", data)
    }, [data])

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
        setLoading(true)
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
                    dispatch(login({ email: loginemail, password: loginpassword }))
                }

                return;
            case REGISTER:
                const registeremail = e.target.email.value;
                const registerpassword = e.target.password.value;
                const registerrepassword = e.target.password.value;

                console.log("Kullanıcı Email:", registeremail);
                console.log("Şifre:", registerpassword);
                console.log("RE Şifre:", registerrepassword);
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
            <div className={`chat-advertise visible`}>

                <div className="chat-advertise-text-content">


                    <h1 class="display-4 mb-4 text-left">Akıllı Alışveriş</h1>
                    <h2 class="display-5 mb-2 text-left">İhtiyacınız Olan Ürünler, Beklediğinizden Hızlı</h2>
                    <h3 class="h5 mb-2 text-left">Yapay Zeka Destekli Keşif</h3>
                    <p class="lead text-left">Aradığınız ürünü basit bir cümleyle tanımlayın, gerisini sistemimize bırakın. Gelişmiş dil anlama yeteneğimiz, aramanızın ardındaki niyeti çözümleyerek size <strong>hem doğrudan eşleşmeler hem de yaratıcı alternatifler</strong> sunar. "Ofis için minimalist masa" aramasıyla sadece masaları değil, çalışma alanınıza uygun aksesuar önerilerini de görebileceksiniz.</p>
                </div>
                <div className="chat-advertise-auth-content">

                    <div className="row align-items-center">
                        <div className="col d-flex justify-content-center">
                            <div className="site-title ms-1">TINNTEN</div>
                            <h6 className=' align-content-center ps-2'>
                                <Badge bg="light mt-2" style={{ color: "#111" }}>Platform</Badge></h6>
                        </div>
                    </div>
                    {renderForm()}
                </div>
               
            </div>
        </>
    )
}


/**
 *  <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">

                        <div className="carousel-item">
                            <img src="https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg" className="d-block w-100" alt="Bisiklet Kaskı" />
                        </div>
                        <div className="carousel-item">
                            <ProductCard product={{
                                product_name: "18 Jant Erkek Bisikleti Siyah",
                                product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
                                product_price: "2.500,00 TL",
                                product_brand: "Bisiklet Markası"
                            }} openDetail={null} />
                        </div>

                        <div className="carousel-item">
                            <ProductCard product={{
                                product_name: "Bisiklet Kaskı",
                                product_image: "bisiklet_kaski.jpg",
                                product_price: "150,00 TL",
                                product_brand: "Aksesuar Markası",
                            }} openDetail={null} />
                        </div>
                        <div className="carousel-item">
                            <ProductCard product={{
                                product_name: "Bisiklet Kaskı",
                                product_image: "bisiklet_kaski.jpg",
                                product_price: "150,00 TL",
                                product_brand: "Aksesuar Markası",
                            }} openDetail={null} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Önceki</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Sonraki</span>
                    </button>
                </div>
 */