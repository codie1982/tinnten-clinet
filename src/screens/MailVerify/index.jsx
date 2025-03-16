import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { sendmailcode } from "../../api/auth/authSlicer";
import MailVerifyForm from '../../components/MailVerifyForm';
import { useNavigate } from "react-router-dom";
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
export default function MailVerify({ sendCode }) {
    const [t, i18n] = useTranslation("global")
    const { isLogin, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isError, isSendCodeLoading, isSuccess } = useSelector((state) => state.auth);

    const [isCodeSending, setIsCodeSending] = useState(sendCode)
    const [formValidation, setFormValidation] = useState({
        mailVerify: {
            code: {
                error: false, message: ""
            },
        }
    });



    const resetValidation = () => {
        setFormValidation({
            mailVerify: {
                code: {
                    error: false, message: ""
                },
            }
        });
    };


    const handleSubmit = () => {
        if (isCodeSending) {
            resetValidation();
            const code = e.target.code.value;
            let hasError = false;
            if (!code) {
                setFormValidation((prev) => ({
                    ...prev,
                    mailVerify: {
                        code: {
                            error: false, message: "kod alanı boş olamaz"
                        },
                    }
                }));
                hasError = true;
            }
            console.log("hasError", hasError)
            if (hasError) return; // 🚩 Hata varsa işlemi durdur
            // Doğruysa login işlemi başlat
        }
        dispatch(sendmailcode())
    };

    useEffect(() => {
        if (!isSendCodeLoading) {
            if (isSuccess) {
                setIsCodeSending(true)
            }
        }
    }, [isError, isSendCodeLoading, isSuccess])


    // ✅ Kullanıcı giriş yapmamışsa login sayfasına yönlendir

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
            <MailVerifyForm handleLoginSubmit={handleSubmit}
                validation={formValidation.mailVerify} isLoading={isSendCodeLoading} isCodeSending={isCodeSending} sendingCodeHandle={handleSubmit} />
        </div>
    );
}