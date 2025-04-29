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

export default function MailVerifyForm({ remindingTime, validation, isLoading, isCodeSending, verifyMailCode, sendingCode, isActiveButton }) {
    const [t, i18n] = useTranslation("global")

    const handleSubmit = (e) => {
        e.preventDefault();
        isCodeSending ? verifyMailCode(e.target.code.value) : sendingCode()
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
                                <Form.Control type="text" name='code' placeholder={`${isCodeSending ? t("form.mail.send_code_placeholder") : t("form.mail.normal_placeholder")}`} className={`form-control icon-control  ${validation != null && validation.code.error ? "error-control" : ""}`} />
                                <div className="input-icon-left-container">
                                    <span><FontAwesomeIcon size='lg' color='#656565' icon={faEnvelope} /></span>
                                </div>
                            </Form.Group>
                            {validation != null && validation.code.error ?
                                <>
                                    <div className="error-message visible">
                                        <span>{validation.code.message}</span>
                                    </div></>
                                :
                                <></>}
                        </div>
                    </> : <></>}

                    {isCodeSending ?
                        <div className="row">
                            <div className="col">
                                <div className="form-check">
                                    <p> {`Süre : ${remindingTime} sn`}</p>
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
                            disabled={isLoading && !isActiveButton}
                            className={` col btn m-t-1 btn-block ${!isActiveButton ? "btn-mail-login-disable" : "btn-mail-login"}`}
                            style={{
                                width: '100%',

                            }}
                        >{isLoading ? t("form.mail.loading") : isCodeSending ? t("form.mail.entercode") : t("form.mail.sendcode") }
                        </Button>
                    </ButtonGroup>
                </Form>
            </div>
        </>
    )
}
