import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge, Row, Col
} from 'react-bootstrap'
import { useNavigate, Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash, faCodeFork } from '@fortawesome/free-solid-svg-icons';
import { LOGIN } from '../../constant'
import { useTranslation } from "react-i18next"
import logo from "../../assets/char-logo.png"

export default function RegisterForm({ handleRegisterSubmit, isSendCode, validation }) {
    const [t, i18n] = useTranslation("global")
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Şifre görünürlüğünü değiştir
    };
    return (
        <>
            <p className="standart-dark-text">{t("form.register.title")}</p>
            <Link to={"/"}>
                <div className="site-logo mb-2">
                    <img src={logo} alt="Logo" className="tinnten logo" />
                </div>
            </Link>


            <div className="container-fluid">
                <Form id="login-form" className="form" onSubmit={handleRegisterSubmit}>
                    <div className="icon-container">
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Control type="text" placeholder="Email adresi" className={`form-control icon-control  ${validation != null && validation.email.error ? "error-control" : ""}`} />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faEnvelope} /></span>
                            </div>
                        </Form.Group>
                        {validation != null && validation.email.error ?
                            <>
                                <div className="error-message visible">
                                    <span>{validation.email.message}</span>
                                </div></>
                            :
                            <></>}
                    </div>
                    <div className="icon-container">
                        <Form.Group controlId="password">
                            <Form.Control
                                className={`icon-control ${validation != null && validation.password.error ? "error-control" : ""}`}
                                type={showPassword ? "text" : "password"} // Şifre görünürlüğüne göre input tipi
                                placeholder="Şifrenizi girin"
                                name='password'
                            />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faLock} /></span>
                            </div>
                            <div className="input-icon-right-container" onClick={togglePasswordVisibility}>
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={showPassword ? faEye : faEyeSlash} /></span>
                            </div>
                        </Form.Group>
                        {validation != null && validation.password.error ?
                            <>
                                <div className="error-message visible">
                                    <span>{validation.password.message}</span>
                                </div></>
                            :
                            <></>}
                    </div>
                    <div className="icon-container">
                        <Form.Group controlId="repassword">
                            <Form.Control
                                className={`icon-control ${validation != null && validation.repassword.error ? "error-control" : ""}`}
                                type={showPassword ? "text" : "password"} // Şifre görünürlüğüne göre input tipi
                                placeholder="Yeniden Şifrenizi girin"
                                name='repassword'
                            />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faLock} /></span>
                            </div>
                            <div className="input-icon-right-container" onClick={togglePasswordVisibility}>
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={showPassword ? faEye : faEyeSlash} /></span>
                            </div>
                        </Form.Group>
                        {validation != null && validation.repassword.error ?
                            <>
                                <div className="error-message visible">
                                    <span>{validation.repassword.message}</span>
                                </div></>
                            :
                            <></>}
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-box" id="angrement" />
                                <div className="custom-checkbox"></div>
                                <label className={`form-check-label ${validation != null && validation.angrement.error ? "error-label" : ""}`} htmlFor="angrement">{t("form.register.angrement")}{`\n`}<Link className="form-check-label tolink" to='/consumer-terms'>{t("form.register.terms")}</Link> {t("form.register.and")} <Link className="form-check-label tolink" to="/privatepolicy">{t("form.register.privatepolicy")}</Link></label>
                            </div>
                            {validation != null && validation.angrement.error ?
                                <>
                                    <div className="error-message visible">
                                        <span>{validation.angrement.message}</span>
                                    </div></>
                                :
                                <></>}
                        </div>
                    </div>
                    <ButtonGroup vertical>
                        <Button type="submit" size="lg" className="col btn m-t-2 btn-block btn-google-login" variant="outline-warning" style={{ width: '100%' }}>
                            {t("form.register.button")}
                        </Button>
                    </ButtonGroup>
                    <div className="d-flex align-content-center text-container">
                        <p>
                            <Link to="/login" className="text-decoration-none">
                                {t("form.register.login")}
                            </Link>
                        </p>
                    </div>
                </Form>
            </div>
        </>
    )
}
