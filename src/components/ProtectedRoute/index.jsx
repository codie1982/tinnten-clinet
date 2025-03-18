import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Outlet } from "react-router-dom";
import MailVerify from "screens/MailVerify";
export default function ProtectedRoute() {
    const [isSendingCode, setIsSendingCode] = useState()
    const { isLogin, user } = useAuth();
    const { sendCode, isError, isSuccess, isSendCodeLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isSendCodeLoading)
            if (sendCode != null && sendCode != undefined) {
                setIsSendingCode(sendCode)
            }

    }, [sendCode, isError, isSuccess, isSendCodeLoading])



    if (user != null)
        if (!user.email_verified) {
            return <div className="form-section">
                <div className="form-content form-content-left-side">
                    <MailVerify sendCode={isSendingCode} />
                </div>
                <div className="form-content form-content-right-side">
                    <div className="form-content-desctiption">Tinnten 1.0 burada</div>
                    <div className="form-content-text">Mail Kutunuza 6 haneli bir kod gönderdik. <br />Mail hesabınızı onaylamak için o kodu girmelisiniz.</div>
                    <div className="form-content-subtext">Tinnten henüz çok yeni bir girişim.<br /> bu yüzden bazı mail adresleri için doğrulama konu spam klasörüne düşebilir.<br /> Eğer kod gelmemiş gözüküyor ise span klasörünüzü kontrol etmeyi unutmayınız</div>
                </div>
            </div>
        }
    // ✅ Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }
    // ✅ Kullanıcı giriş yapmışsa içeriği göster
    return <Outlet />;
}