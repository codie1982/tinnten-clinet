import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MAILVERIFY } from '../../constant'

export default function RegisterForm({ setState }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        console.log("Kullanıcı Adı:", username);
        console.log("Şifre:", password);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Şifre görünürlüğünü değiştir
    };
    return (
        <>
            <p className="standart-dark-text">mail adresine gelen kodu girebilirsin!.</p>
            <div className="container-fluid">
                <Form id="login-form" className="form" onSubmit={handleSubmit}>
                    <div className="icon-container">
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Control type="text" placeholder="Kullanıcı Adı" className="form-control icon-control" />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faEnvelope} /></span>
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
                        <Button
                            type="submit"
                            size="lg"
                            className="col btn m-t-1 btn-block btn-mail-login"
                            style={{
                                width: '100%',

                            }}
                        >
                            Kayıt Ol
                        </Button>
                        <div className="row">
                            <div className="col align-items-center">
                                <p className="">veya</p>
                            </div>
                        </div>
                        <Button size="lg" className="col btn m-t-2 btn-block btn-google-login" variant="outline-warning" style={{ width: '100%' }}>
                            Google ile Kayıt Ol</Button>
                    </ButtonGroup>
                    <div className="d-flex align-content-center justify-content-between text-container">
                        <p><a onClick={() => { setState(MAILVERIFY) }} className="text-decoration-none" href='#'>Giriş yapmak için tıklayın</a></p>
                    </div>
                </Form>
            </div>
        </>
    )
}
