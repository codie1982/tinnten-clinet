import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {
    Form, Button, ButtonGroup, Badge
  } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const { isLogin } = useAuth()
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
        <div className={`chat-advertise ${isLogin ? "visible" : "hidden"}`}>
            <div className="chat-advertise-text-content">
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="resim1.jpg" className="d-block w-100" alt="Resim 1" />
                        </div>
                        <div className="carousel-item">
                            <img src="resim2.jpg" className="d-block w-100" alt="Resim 2" />
                        </div>
                        <div className="carousel-item">
                            <img src="resim3.jpg" className="d-block w-100" alt="Resim 3" />
                        </div>
                        <div className="carousel-item">
                            <img src="resim4.jpg" className="d-block w-100" alt="Resim 4" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Önceki</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Sonraki</span>
                    </button>
                </div>

                <h1 class="display-4 mb-4 text-left">Akıllı Alışveriş</h1>
                <h2 class="display-5 mb-2 text-left">İhtiyacınız Olan Ürünler, Beklediğinizden Hızlı</h2>
                <h3 class="h5 mb-2 text-left">Yapay Zeka Destekli Keşif</h3>
                <p class="lead text-left">Aradığınız ürünü basit bir cümleyle tanımlayın, gerisini sistemimize bırakın. Gelişmiş dil anlama yeteneğimiz, aramanızın ardındaki niyeti çözümleyerek size <strong>hem doğrudan eşleşmeler hem de yaratıcı alternatifler</strong> sunar. "Ofis için minimalist masa" aramasıyla sadece masaları değil, çalışma alanınıza uygun aksesuar önerilerini de görebileceksiniz.</p>
            </div>
            <div className="chat-advertise-auth-content">


                {/*  <div className='site-logo-container'>
              <div className="site-logo">
                <img src={logo} alt="Logo" className="logo" />
              </div>
            </div> */}
                <div className="row align-items-center">
                    <div className="col d-flex justify-content-center">
                        <div className="site-title ms-1">TINNTEN</div>
                        <h6 className=' align-content-center ps-2'>
                            <Badge bg="light mt-2" style={{ color: "#111" }}>Platform</Badge></h6>
                    </div>
                </div>

                <p className="standart-dark-text">Sadece main adresi ve google ile giriş yapabilirsiniz. şimdilik!.</p>
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
                        <div className="icon-container">
                            <Form.Group controlId="password">
                                <Form.Control
                                    className='icon-control'
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
                            <p><a href="#" className="text-decoration-none">Şifremi Unuttum?</a></p>
                            <p><a className="text-decoration-none" href='#'>Kayıt olmak için tıklayın</a></p>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
