import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { LOGIN, MAILVERIFY } from '../../constant'

export default function ForgotPasswordFrom({ setState }) {
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
            <p className="standart-dark-text">Şifreni yenilemek için mail adresini girebilirsin.!.</p>
            <div className="container-fluid">
                <Form id="login-form" className="form" onSubmit={handleSubmit}>
                    <div className="icon-container">
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Control type="text" placeholder="Email adresinizi girin" className="form-control icon-control" />
                            <div className="input-icon-left-container">
                                <span><FontAwesomeIcon size='lg' color='#656565' icon={faEnvelope} /></span>
                            </div>
                        </Form.Group>
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
                            Şifremi yenile
                        </Button>
                    </ButtonGroup>
                    <div className="d-flex align-content-center justify-content-between text-container">
                        <p><a onClick={() => { setState(LOGIN) }} className="text-decoration-none" href='#'>Giriş yapmak için tıklayın</a></p>
                    </div>
                </Form>
            </div>
        </>
    )
}
