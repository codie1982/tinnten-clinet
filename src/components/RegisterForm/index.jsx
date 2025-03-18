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

export default function RegisterForm({ handleRegisterSubmit, isSendCode }) {
    const [t, i18n] = useTranslation("global")
    const [showPassword, setShowPassword] = useState(false);
    const [_isSendCode, setIsSendCode] = useState(false)
    useEffect(() => {
        setIsSendCode(isSendCode)
    }, [isSendCode])


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
                            <Form.Control type="text" placeholder="Email adresi" className="form-control icon-control" />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faEnvelope} /></span>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="icon-container">
                        <Form.Group controlId="password">
                            <Form.Control
                                className='icon-control'
                                type={showPassword ? "text" : "password"} // Şifre görünürlüğüne göre input tipi
                                placeholder="Şifrenizi girin"
                            />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faLock} /></span>
                            </div>
                            <div className="input-icon-right-container" onClick={togglePasswordVisibility}>
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={showPassword ? faEye : faEyeSlash} /></span>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="icon-container">
                        <Form.Group controlId="repassword">
                            <Form.Control
                                className='icon-control'
                                type={showPassword ? "text" : "password"} // Şifre görünürlüğüne göre input tipi
                                placeholder="Yeniden Şifrenizi girin"
                            />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faLock} /></span>
                            </div>
                            <div className="input-icon-right-container" onClick={togglePasswordVisibility}>
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={showPassword ? faEye : faEyeSlash} /></span>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-box" id="rememberMe" />
                                <div className="custom-checkbox"></div>
                                <label className="form-check-label" htmlFor="rememberMe">{t("form.register.angrement")}<Link to='/consumer-terms'>{t("form.register.terms")}</Link> {t("form.register.and")} <Link to="/privatepolicy">{t("form.register.privatepolicy")}</Link></label>
                            </div>
                        </div>
                    </div>
                    <ButtonGroup vertical>
                        {_isSendCode ?
                            <Button
                                type="submit"
                                size="lg"
                                className="col btn m-t-1 btn-block btn-register"
                                style={{
                                    width: '100%',
                                }}
                            >
                                {t("form.register.resendcode")}
                            </Button>
                            :
                            <Button size="lg" className="col btn m-t-2 btn-block btn-google-login" variant="outline-warning" style={{ width: '100%' }}>
                                {t("form.register.sendcode")}
                            </Button>
                        }
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
