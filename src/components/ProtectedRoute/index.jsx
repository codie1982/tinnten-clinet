import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Outlet } from "react-router-dom";
import MailVerify from "screens/MailVerify";
export default function ProtectedRoute() {
    const { isLogin, isLoading, user, profiles, sendCode } = useAuth();
    console.log("user, profiles", user)

    if (user != null)
        if (!user.email_verified) {
            return <div className="form-section">
                <div className="form-content form-content-left-side">
                    <MailVerify sendCode={sendCode} />
                </div>
                <div className="form-content form-content-right-side">
                    <div className="form-content-desctiption">Tinnten 1.0 burada</div>
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