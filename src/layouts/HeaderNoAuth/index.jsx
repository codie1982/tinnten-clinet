import React from 'react'
import { Link, useNavigate, } from "react-router-dom";
import logo from '../../assets/char-logo.png'

export default function HeaderNoAuth() {
    return (
        <header className="page-noauth-header">
            <div className="page-noauth-logo-container">
                <Link className="page-noauth-main-link" to="/" >
                    <img className="site-logo-mini" src={logo} />
                    <span>TINNTEN AI</span>
                </Link>

            </div>


            <nav className="nav-noauth-menu">
                <ul>
                    <li><Link to={"/abouth"}>Hakkımızda</Link></li>
                    <li><Link to={"/works"}>Nasıl Çalışır?</Link></li>
                    <li><Link to={"/contact"}>İletişim</Link></li>
                </ul>
            </nav>
            <div className="auth-buttons">
                <Link to="/login" className="login-btn">Giriş Yap</Link>
                <Link to="/register" className="signup-btn">Kayıt Ol</Link>
            </div>
        </header>
    )
}
