import React from 'react'
import { Link, useNavigate, } from "react-router-dom";
import logo from '../../assets/char-logo.png'
import { useTranslation } from "react-i18next"

export default function HeaderNoAuth() {
    const [t, i18n] = useTranslation("global")
    return (
        <header className="page-noauth-header">
            <div className="page-noauth-logo-container">
                <Link className="page-noauth-main-link" to="/" >
                    <img className="site-logo-mini" src={logo} />
                    <span>{t("appname")}</span>
                </Link>
            </div>
            <nav className="nav-noauth-menu">
                <ul>
                    <li><Link to={"/abouth"}>{t("headerNoAuth.menu.abouth")}</Link></li>
                    <li><Link to={"/works"}>{t("headerNoAuth.menu.works")}</Link></li>
                    <li><Link to={"/contact"}>{t("headerNoAuth.menu.contact")}</Link></li>
                </ul>
            </nav>
            <div className="auth-buttons">
                <Link to="/login" className="login-btn">{t("headerNoAuth.login")}</Link>
                <Link to="/register" className="signup-btn">{t("headerNoAuth.register")}</Link>
            </div>
        </header>
    )
}
