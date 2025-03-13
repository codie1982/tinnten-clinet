import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Outlet } from "react-router-dom";
export default function ProtectedRoute() {
    const { isLogin, isLoading,data } = useAuth();

    console.log("isLogin:", isLogin, "isLoading:", isLoading);
    
    console.log("data:", data);
    // ✅ Yüklenme tamamlanana kadar beklet
    if (isLoading) {
        return <div>Loading...</div>;  // Burada Spinner gösterebilirsiniz
    }

    // ✅ Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Kullanıcı giriş yapmışsa içeriği göster
    return <Outlet />;
}