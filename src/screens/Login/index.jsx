import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { login, createGoogleurl } from "../../api/auth/authSlicer";
import LoginForm from '../../components/LoginForm';
import { useNavigate } from "react-router-dom";
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import useAgentSocket from '../../hooks/useAgentSocket';
export default function Login() {
    const [t, i18n] = useTranslation("global")
    const { isLogin, isLoading: authLoading } = useAuth();
    const { connectSocket } = useAgentSocket()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formValidation, setFormValidation] = useState({
        login: {
            email: { error: false, message: "" },
            password: { error: false, message: "" },
        },
    });

    const { isError, isLoading, isSuccess, data, url } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isSuccess && data) {
            console.log("isSuccess, data", isSuccess, data)
            navigate("/conversation");  // Başarılı giriş sonrası yönlendirme
            connectSocket()
        }
    }, [isSuccess, data]);


    useEffect(() => {
        console.log("isLoading, isSuccess, url", isLoading, isSuccess, url)

        if (!isLoading)
            if (isSuccess && url)
                window.location.replace(url)

    }, [isLoading, isSuccess, url]);


    const resetValidation = () => {
        setFormValidation({
            login: {
                email: { error: false, message: "" },
                password: { error: false, message: "" },
            },
        });

    };

    const handleCreateGoogleUrl = () => {
        dispatch(createGoogleurl())
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        resetValidation();

        const email = e.target.email.value;
        const password = e.target.password.value;


        let hasError = false;

        if (!email) {
            setFormValidation((prev) => ({
                ...prev,
                login: {
                    ...prev.login,
                    email: { error: true, message: "Email alanı boş olamaz." },
                },
            }));
            hasError = true;
        }

        if (!password) {
            setFormValidation((prev) => ({
                ...prev,
                login: {
                    ...prev.login,
                    password: { error: true, message: "Şifre alanı boş olamaz." },
                },
            }));
            hasError = true;
        }
        console.log("hasError", hasError)
        if (hasError) return; // 🚩 Hata varsa işlemi durdur
        console.log("email, password", email, password)
        // Doğruysa login işlemi başlat
        dispatch(login({ email, password, device: "web" }));
    };
    // ✅ Yüklenme tamamlanana kadar beklet
    if (authLoading) {
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
                    <h6 className='align-content-center ps-2'>
                        <Badge bg="light mt-2" style={{ color: "#111" }}>{t("beta")}</Badge>
                    </h6>
                </div>
            </div>
            <LoginForm handleLoginSubmit={handleSubmit} handleCreateGoogleUrl={handleCreateGoogleUrl} validation={formValidation.login} isLoading={isLoading} />
        </div>
    );
}