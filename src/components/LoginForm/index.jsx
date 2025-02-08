import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge,
    Nav
} from 'react-bootstrap'
import { useNavigate, Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { REGISTER, FORGOTPASSWORD } from '../../constant'

export default function LoginForm({ setState, handleLoginSubmit, validation, reset, isLoading }) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Şifre görünürlüğünü değiştir
    };
    return (
        <>
            <p className="standart-dark-text">mail adresi ve google ile giriş yapabilirsiniz.</p>
            <div className="container-fluid">
                <Form id="login-form" className="form" onSubmit={!isLoading ? handleLoginSubmit : null}>
                    <div className="icon-container">
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Control type="text" placeholder="Email Adresi" className={`form-control icon-control  ${validation != null && validation.email.error ? "error-control" : ""}`} />
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
                                placeholder="Şifre"
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

                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-box" id="rememberMe" />
                                <div className="custom-checkbox"></div>
                                <label className={`form-check-label ${validation != null && validation.password.error ? "error-label" : ""}`} htmlFor="rememberMe">Beni hatırla</label>
                            </div>
                        </div>
                    </div>
                    <ButtonGroup vertical>
                        <Button
                            type="submit"
                            size="lg"
                            className="col btn m-t-1 btn-block btn-mail-login"
                            disabled={isLoading}
                            style={{
                                width: '100%',

                            }}
                        >
                            Giriş Yap
                        </Button>
                        <div className="row">
                            <div className="col align-items-center">
                                <p className="">veya</p>
                            </div>
                        </div>
                        <Button size="lg" className="col btn m-t-2 btn-block btn-google-login" variant="outline-warning" style={{ width: '100%' }}>
                            Google ile Giriş Yap</Button>
                    </ButtonGroup>
                    <div className="d-flex align-content-center justify-content-between text-container">

                        <p>
                            <Link to="/register" className="text-decoration-none">
                                Kayıt olmak için tıklayın
                            </Link>
                        </p>
                        <p>
                            <Link to="/forgotpassword" className="text-decoration-none">
                                Şifremi unuttum
                            </Link>
                        </p>
                    </div>
                </Form>
            </div>
        </>

    )
}
