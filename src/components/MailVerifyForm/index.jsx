import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge
} from 'react-bootstrap'
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MAILVERIFY } from '../../constant'
import { useTranslation } from "react-i18next"
import logo from "../../assets/char-logo.png"

export default function MailVerifyForm({ handleLoginSubmit, validation, isLoading, isCodeSending, sendingCodeHandle }) {
    const [t, i18n] = useTranslation("global")
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendingCodeHandle()
    }

    return (
        <>
            <p className="standart-dark-text">{t("form.mail.title")}</p>
            <Link to={"/"}>
                <div className="site-logo mb-2">
                    <img src={logo} alt="Logo" className="tinnten logo" />
                </div>
            </Link>
            <div className="container-fluid">
                <Form id="login-form" className="form" onSubmit={handleSubmit}>
                    {isCodeSending ? <>
                        <div className="icon-container">
                            <Form.Group controlId="username" className="mb-3">
                                <Form.Control type="text" placeholder={`${isCodeSending ? t("form.mail.send_code_placeholder") : t("form.mail.normal_placeholder")}`} className="form-control icon-control" />
                                <div className="input-icon-left-container">
                                    <span><FontAwesomeIcon size='lg' color='#656565' icon={faEnvelope} /></span>
                                </div>
                            </Form.Group>
                        </div>
                    </> : <></>}

                    {isCodeSending ?
                        <div className="row">
                            <div className="col">
                                <div className="form-check">
                                    <p> Süre : 180 sn</p>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                    }
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="rememberMe">{t("form.mail.description")}</label>
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
                        >{t("form.mail.sendcode")}
                        </Button>
                    </ButtonGroup>
                </Form>
            </div>
        </>
    )
}
