import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login, register } from "../../api/auth/authSlicer"
import RegisterForm from '../../components/RegisterForm'
import { useNavigate, } from "react-router-dom";
import { Badge } from 'react-bootstrap'
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { useRecaptchaToken } from "../../hooks/useRecaptchaToken";

export default function Register() {
    const [t, i18n] = useTranslation("global")

    const { isLogin, isLoading: reduxLoading } = useAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSendCode, setIsSendCode] = useState(false)
    const { isError, isLoading, isSuccess, data } = useSelector((state) => { return state.auth })
    const { token, loading, error, refresh } = useRecaptchaToken("register");
    const refreshAndGet = async () => {
        try {
            await refresh();
            return { token };
        } catch (err) {
            console.error("Yeni captcha alınamadı:", err);
            return { token: null };
        }
    };
    const [formValidation, setFormValidation] = useState({
        register: {
            email: { error: false, message: "" },
            password: { error: false, message: "" },
            repassword: { error: false, message: "" },
            angrement: { error: false, message: "" }
        }
    })


    const resetValidation = () => {
        setFormValidation({
            register: {
                email: { error: false, message: "" },
                password: { error: false, message: "" },
                repassword: { error: false, message: "" },
                angrement: { error: false, message: "" }
            }
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault()
        // 🔥 FORM SUBMIT OLACAĞI ZAMAN YENİ TOKEN AL
        const { token: freshToken } = await refreshAndGet();
        if (!freshToken) return alert("reCAPTCHA token alınamadı.");
        resetValidation()
        setIsSendCode(true)
        const registeremail = e.target.email.value;
        const registerpassword = e.target.password.value;
        const registerrepassword = e.target.repassword.value;
        const angrement = e.target.angrement.checked;

        let hasError = false;
        if (!registeremail) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    email: { error: true, message: "Email alanı boş olamaz." },
                },
            }));
            hasError = true;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registeremail)) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    email: { error: true, message: "Geçerli bir email adresi giriniz." },
                },
            }));
            hasError = true;
        }

        if (!registerpassword) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    password: { error: true, message: "Şifre alanı boş olamaz." },
                },
            }));
            hasError = true;
        }

        if (registerpassword.length < 6) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    password: { error: true, message: "min 6 karatkerli bir şifre giriniz." },
                },
            }));
            hasError = true;
        }
        if (registerpassword.length >= 8) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    password: { error: true, message: "max 8 karatkerli bir şifre giriniz." },
                },
            }));
            hasError = true;
        }

        if (registerpassword !== registerrepassword) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    repassword: { error: true, message: "Girdiğiniz şifreler aynı değil." },
                },
            }));
            hasError = true;
        }
        if (!angrement) {
            setFormValidation((prev) => ({
                ...prev,
                register: {
                    ...prev.register,
                    angrement: { error: true, message: "Kullanım koşullarını kabul etmelisiniz." },
                },
            }));
            hasError = true;
        }
        console.log("hasError", hasError)
        console.log("formValidation", formValidation)
        if (hasError) return; // 🚩 Hata varsa işlemi durdur
        console.log("email, password", registeremail, registerpassword)

        dispatch(register({
            email: registeremail, password: registerpassword,
            repassword: registerrepassword, device: "web",
            captcha_token: token, angrement: angrement
        }))
    }

    // ✅ Yüklenme tamamlanana kadar beklet
    if (reduxLoading) {
        return <div>Loading...</div>;  // Burada Spinner gösterebilirsiniz
    }

    // ✅ Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (isLogin) {
        return <Navigate to="/conversation" replace />;
    }
    return (
        <div className="chat-advertise-auth-content">

            <div className="row align-items-center">
                <div className="col d-flex justify-content-center">
                    <div className="site-title ms-1">{t("appname")}</div>
                    <h6 className=' align-content-center ps-2'>
                        <Badge bg="light mt-2" style={{ color: "#111" }}>{t("beta")}</Badge></h6>
                </div>
            </div>
            <RegisterForm handleRegisterSubmit={handleSubmit} validation={formValidation.register} isSendCode={isSendCode} isLoading={isLoading} />
        </div>
    )
}
