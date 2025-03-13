import React,{useEffect,useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { googlelogin } from "../../api/auth/authSlicer"
export default function GoogleAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const error = params.get("error");
    if (success === "true") {
      dispatch(googlelogin())
    } else {
      alert("Google Girişi Başarısız: " + error);
      navigate("/login");
    }
  }, [location, navigate]);
  return (
    <div>
      <h2>Google Giriş Yapılıyor...</h2>
    </div>
  )
}
