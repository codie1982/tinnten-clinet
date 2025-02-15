import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../api/auth/authSlicer";
import LoginForm from '../../components/LoginForm';
import { useNavigate } from "react-router-dom";
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import { Navigate } from "react-router-dom";

export default function Login() {
    const { isLogin, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formValidation, setFormValidation] = useState({
        login: {
            email: { error: false, message: "" },
            password: { error: false, message: "" },
        },
    });



    const { isError, isLoading, isSuccess, data } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isSuccess && data) {
            navigate("conversation");  // Başarılı giriş sonrası yönlendirme
        }
    }, [isSuccess, data]);

    const resetValidation = () => {
        setFormValidation({
            login: {
                email: { error: false, message: "" },
                password: { error: false, message: "" },
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        resetValidation();

        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log("email, password", email, password)

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
    console.log("authLoading", authLoading)
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
                    <div className="site-title ms-1">TINNTEN</div>
                    <h6 className='align-content-center ps-2'>
                        <Badge bg="light mt-2" style={{ color: "#111" }}>Platform</Badge>
                    </h6>
                </div>
            </div>
            <LoginForm handleLoginSubmit={handleSubmit} validation={formValidation.login} isLoading={isLoading} />
        </div>
    );
}