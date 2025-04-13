import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { googlelogin } from "../../api/auth/authSlicer"
import { useAuth } from '../../context/authContext';
import { Navigate } from "react-router-dom";

export default function GoogleAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, isLoading: authLoading } = useAuth();
  const { data, isError, isLoading: reduxLoading, isSuccess, isLogout } = useSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const token = params.get("token");
    const error = params.get("error");

    if (success === "true") {
      console.log("success")
      dispatch(googlelogin(token))

    } else {
      alert("Google Girişi Başarısız: " + error);
      navigate("/login");
    }
  }, [location, navigate]);

  // ✅ Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (isLogin) {
    return <Navigate to="/conversation" replace />;
  }


  return (
    <div>
      <h2>Google Giriş Yapılıyor...</h2>
    </div>
  )
}
