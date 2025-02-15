import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login, register } from "../../api/auth/authSlicer"
import RegisterForm from '../../components/RegisterForm'
import { useNavigate, } from "react-router-dom";
import { Badge } from 'react-bootstrap'
import { Navigate } from "react-router-dom";

export default function Register() {
    const { isLogin, isLoading: reduxLoading } = useAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const validation = {
        register: {
            email: {
                error: false, message: ""
            },
            password: {
                error: false, message: ""
            },
            rePassword: {
                error: true, message: ""
            }
        }
    }
    const [isSendCode, setIsSendCode] = useState(false)
    const { isError, isLoading, isSuccess, data } = useSelector((state) => { return state.auth })
    const [formValidation, setFormValidation] = useState(validation)

    useEffect(() => {
    }, [isError, isLoading, isSuccess, data])


    const resetValidation = () => {
        setFormValidation(validation)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        resetValidation()
        setIsSendCode(true)

        const registeremail = e.target.email.value;
        const registerpassword = e.target.password.value;
        const registerrepassword = e.target.password.value;
        if (registerpassword == registerrepassword) {
        }
        dispatch(register({
            email: registeremail, password: registerpassword, repassword: registerrepassword
        }))
    }

    // ✅ Yüklenme tamamlanana kadar beklet
    if (reduxLoading) {
        return <div>Loading...</div>;  // Burada Spinner gösterebilirsiniz
    }

    // ✅ Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (isLogin) {
        return <Navigate to="/conversation" replace />;
    }
    return (
        <div className="chat-advertise-auth-content">

            <div className="row align-items-center">
                <div className="col d-flex justify-content-center">
                    <div className="site-title ms-1">TINNTEN</div>
                    <h6 className=' align-content-center ps-2'>
                        <Badge bg="light mt-2" style={{ color: "#111" }}>Platform</Badge></h6>
                </div>
            </div>
            <RegisterForm handleRegisterSubmit={handleSubmit} validation={formValidation.register} isSendCode={isSendCode} />
        </div>
    )
}
