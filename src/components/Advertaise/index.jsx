import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login, register } from "../../api/auth/authSlicer"
import { useNavigate, } from "react-router-dom";
import { Badge } from 'react-bootstrap'

import LoginForm from "../LoginForm"
import RegisterForm from "../RegisterForm"
import MailVerifyForm from "../MailVerifyForm"
import ForgotPasswordFrom from "../ForgotPasswordFrom"
import { LOGIN, REGISTER, MAILVERIFY, GOOGLE, FORGOTPASSWORD } from '../../constant'


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
            <div className={`chat-advertise visible`}>
                <div className="chat-advertise-text-content">


                    <h1 class="display-4 mb-4 text-left">Akıllı Alışveriş</h1>
                    <h2 class="display-5 mb-2 text-left">İhtiyacınız Olan Ürünler, Beklediğinizden Hızlı</h2>
                    <h3 class="h5 mb-2 text-left">Yapay Zeka Destekli Keşif</h3>
                    <p class="lead text-left">Aradığınız ürünü basit bir cümleyle tanımlayın, gerisini sistemimize bırakın. Gelişmiş dil anlama yeteneğimiz, aramanızın ardındaki niyeti çözümleyerek size <strong>hem doğrudan eşleşmeler hem de yaratıcı alternatifler</strong> sunar. "Ofis için minimalist masa" aramasıyla sadece masaları değil, çalışma alanınıza uygun aksesuar önerilerini de görebileceksiniz.</p>
                </div>
            </div>
        </>
    )
}