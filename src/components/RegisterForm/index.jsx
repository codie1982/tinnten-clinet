import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash, faCodeFork } from '@fortawesome/free-solid-svg-icons';
import { LOGIN } from '../../constant'

export default function RegisterForm({ setState, handleRegisterSubmit, isSendCode }) {
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
            <p className="standart-dark-text">email ile kayıt olurken mail adresine gelen kodu girmelisin. şimdilik!.</p>
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
                                <label className="form-check-label" htmlFor="rememberMe">I confirm that I have read, consent and agree to DeepSeek's <a href='#'>Terms of Use</a> and <a href="#">Privacy Policy</a></label>
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
                                Kodu Gönder
                            </Button>
                            :
                            <Button size="lg" className="col btn m-t-2 btn-block btn-google-login" variant="outline-warning" style={{ width: '100%' }}>
                                Kodu gönder
                            </Button>
                        }
                    </ButtonGroup>
                    <div className="d-flex align-content-center text-container">
                        <p><a onClick={() => { setState(LOGIN) }} className="text-decoration-none" href='#'>Giriş yapmak için tıklayın</a></p>
                    </div>
                </Form>
            </div>
        </>
    )
}
