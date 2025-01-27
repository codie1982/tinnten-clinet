import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, } from "react-router-dom";
import {
  Form, Row, Col, Button,
  Dropdown, DropdownButton,
  ListGroup, Container,
  BadgeNavbar, Navbar, Nav, ButtonGroup, Modal as BootstrapModal,
  Accordion, Card, Badge
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import ReactGA from "react-ga4";
import { useCookies } from 'react-cookie';
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSleigh, faLock, faEye, faBars, faHome, faShoppingCart, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from "../../assets/logo.png"

import profilImage from "../../assets/profilImage.jpg"

export default function Home() {
  //ReactGA.send({ hitType: "pageview", page: "/", title: "Home Page" });
  const { isLoading, user, logout } = useAuth()
  const [cookies, setCookie] = useCookies(['name']);
  const [t, i18n] = useTranslation("global")
  const [chatSection, setChatSection] = useState(false)
  const [isSearchVisible, setSearchVisible] = useState(false); // Arama alanının görünürlüğünü kontrol
  const [isBottomPanel, setBottomPanel] = useState(true); // Pozisyonu kontrol
  const [listPanel, setListPanel] = useState(false)
  const [detailPanel, setDetailPanel] = useState(false)
  const [sideBarToggle, setSideBarToggle] = useState(false)
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false); // Şifre görünürlüğünü kontrol etmek için


  const [recommendationProducts, setRecommendationProducts] = useState([
    {
      productGroup: {
        product_group_name: "Bisiklet",
        product_list: [
          {
            product_name: "15 Jant Kız Bisikleti Pembe",
            product_image: "https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg",
            product_price: "1.970,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "18 Jant Erkek Bisikleti Siyah",
            product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
            product_price: "2.500,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "15 Jant Kız Bisikleti Pembe",
            product_image: "https://m.media-amazon.com/images/I/71fv5NCG97L._AC_SL1500_.jpg",
            product_price: "1.970,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "18 Jant Erkek Bisikleti Siyah",
            product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
            product_price: "2.500,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "15 Jant Kız Bisikleti Pembe",
            product_image: "https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg",
            product_price: "1.970,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "18 Jant Erkek Bisikleti Siyah",
            product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
            product_price: "2.500,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "18 Jant Erkek Bisikleti Siyah",
            product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
            product_price: "2.500,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "18 Jant Erkek Bisikleti Siyah",
            product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
            product_price: "2.500,00 TL",
            product_brand: "Bisiklet Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          }
        ]
      }
    },
    {
      productGroup: {
        product_group_name: "Bisiklet Aksesuarları",
        product_list: [
          {
            product_name: "Bisiklet Kaskı",
            product_image: "bisiklet_kaski.jpg",
            product_price: "150,00 TL",
            product_brand: "Aksesuar Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          },
          {
            product_name: "Bisiklet Çantası",
            product_image: "bisiklet_cantasi.jpg",
            product_price: "100,00 TL",
            product_brand: "Aksesuar Markası",
            filter: [
              {
                brand: ["marka-1", "marka-2", "marka-3"],
              },
              {
                color: ["renk-1", "renk-2", "renk-3"],
              },
              {
                size: ["size-1", "size-2", "size-3"]
              }
            ]
          }
        ]
      }
    }
  ])


  const handleToggleSearch = () => {
    setSearchVisible(!isSearchVisible); // Arama alanını aç/kapat
  };

  const handleTogglePosition = () => {
    setBottomPanel(!isBottomPanel); // Pozisyonu değiştir
  };

  const handleOnSuggest = () => {
    setListPanel(!listPanel)
  }

  const openProductDetail = () => {
    setIsOpenProductDetail(!isOpenProductDetail)
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log("Kullanıcı Adı:", username);
    console.log("Şifre:", password);
    setIsLogin(!isLogin)
  }
  const toggleMenu = () => {

  }
  const toggleSidebar = () => {
    setSideBarToggle(!sideBarToggle);  // Sidebar'ı açıp kapatmak için toggle fonksiyonu
  };
  const setLogin = () => {

  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Şifre görünürlüğünü değiştir
  };

  return (
    <>
      <Container fluid className="main-container">

        {/* Sidebar */}
        <div className={`sidebar ${sideBarToggle ? "open" : "closed"}`}>
          <div className={`sidebar-content ${sideBarToggle ? "" : "closed"}`}>
            <div className='site-logo-container'>
              <div className="site-logo">
                <img src={logo} alt="Logo" className="logo" />
              </div>
            </div>

            <div className="title">
              <h3>Arama Geçmişi</h3>
            </div>
            <ul className={`search-history `}>
              <li>
                <a href="#">Arama 1</a>
                <span className="menu-icon" onClick={toggleMenu}>⋮</span>
                <ul className="menu">
                  <li><a href="#">Aramayı Sil</a></li>

                </ul>
              </li>
              <li>
                <a href="#">Arama 2</a>
                <span className="menu-icon" onClick={toggleMenu}>⋮</span>
                <ul className="menu">
                  <li><a href="#">Aramayı Sil</a></li>
                </ul>
              </li>
              <li>
                <a href="#">Arama 3</a>
                <span className="menu-icon" onClick={toggleMenu}>⋮</span>
                <ul className="menu">
                  <li><a href="#">Aramayı Sil</a></li>
                </ul>
              </li>
            </ul>
            <div className={`plan-features  align-items-center justify-content-between`} onClick={openModal}>
              <div className="plan-features-content">
                <div className="row p-10">
                  <div className="col-3 d-flex justify-content-center align-items-center">
                    <div className="icon-container me-3">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                  </div>
                  <div className="col-9">
                    <div className="text-container">
                      <div className="row">
                        <div className="col text-container-title">Planları Görüntüle</div>
                      </div>
                      <div className="row">
                        <div className="col light">Firmanı Ekle</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="content">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-header-block">
                <Navbar bg="dark" variant="dark" expand="lg" className="w-100">
                  <Container fluid>
                    <Navbar.Brand id="toggleButton" onClick={toggleSidebar} href="#">
                      <FontAwesomeIcon icon={faBars} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                      <Nav className="me-auto">
                        <Nav.Link href="#" className="active" aria-current="page">Ana Sayfa</Nav.Link>
                        <Nav.Link href="#">Hakkında</Nav.Link>
                      </Nav>
                      <Nav className="ms-auto d-flex">
                        <Nav.Item>
                          <Nav.Link className="dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={profilImage} alt="Kullanıcı Avatarı" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                          </Nav.Link>
                          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><Nav.Link className="dropdown-item" href="#">Hizmet 1</Nav.Link></li>
                            <li><Nav.Link className="dropdown-item" href="#">Hizmet 2</Nav.Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Nav.Link className="dropdown-item" href="#">Hizmet 3</Nav.Link></li>
                          </ul>
                        </Nav.Item>
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </div>
            </div>
            <div className={`chat-messages ${!isLogin ? "visible" : "hidden"} `}>
              <ul>
                <li className="message human-message">
                  <Row>
                    <Col>

                      <h3 className="message-title">Insan Mesajı</h3>
                      <div className="message-content">Merhaba!</div>
                    </Col>
                  </Row>
                </li>
                <li className="message system-message">
                  <Row>
                    <Col>
                      <h3 className="message-title">Sistem Mesajı</h3>
                      <div className="message-content">Tabii ki sizin için en iyi seçimleri bulmaya çalışacağım.</div>
                    </Col>
                  </Row>
                  {
                    recommendationProducts != null ? <>
                      <p>Önerilen Ürünler:</p>
                      <Accordion defaultActiveKey="1">
                        {recommendationProducts.map((productGroup, index) => {
                          return (
                            <Accordion.Item eventKey={index} className="product-group-list" key={productGroup.productGroup.product_group_name}>
                              <Accordion.Header className="product-group-title"><h4>{productGroup.productGroup.product_group_name}</h4></Accordion.Header>
                              <Accordion.Body>
                                <Row>
                                  <Col>
                                    <ListGroup className="mt-2" horizontal>
                                      <ListGroup.Item>
                                        <DropdownButton id="dropdown-item-button" title="Dropdown button">
                                          <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
                                          <Dropdown.Item as="button">Action</Dropdown.Item>
                                          <Dropdown.Item as="button">Another action</Dropdown.Item>
                                          <Dropdown.Item as="button">Something else</Dropdown.Item>
                                        </DropdownButton>
                                      </ListGroup.Item>
                                      <ListGroup.Item>
                                        <DropdownButton id="dropdown-item-button" title="Dropdown button">
                                          <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
                                          <Dropdown.Item as="button">Action</Dropdown.Item>
                                          <Dropdown.Item as="button">Another action</Dropdown.Item>
                                          <Dropdown.Item as="button">Something else</Dropdown.Item>
                                        </DropdownButton>
                                      </ListGroup.Item>
                                      <ListGroup.Item>
                                        <DropdownButton id="dropdown-item-button" title="Dropdown button">
                                          <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
                                          <Dropdown.Item as="button">Action</Dropdown.Item>
                                          <Dropdown.Item as="button">Another action</Dropdown.Item>
                                          <Dropdown.Item as="button">Something else</Dropdown.Item>
                                        </DropdownButton>
                                      </ListGroup.Item>
                                    </ListGroup>
                                  </Col>


                                </Row>
                                <div className="product-list">
                                  {productGroup.productGroup.product_list.map((product) => {
                                    return (
                                      <Card className="product-card" key={product.product_name}>
                                        <div className="product-image-container">
                                          <Card.Img variant="bottom" src={product.product_image || "bisiklet.jpg"} alt={product.product_name} />
                                        </div>
                                        <Card.Body className="product-info">
                                          <Card.Text>{product.product_name}</Card.Text>
                                          <Card.Text>{product.product_price}</Card.Text>
                                          <Card.Text>{product.product_brand}</Card.Text>
                                          <Card.Text>Ücretsiz gönderim</Card.Text>
                                          <div className="button-group">
                                            <Button variant="info" onClick={openProductDetail}>Detaylar</Button>
                                            <Button variant="primary" className="go-to-product-button">Ürüne Git</Button>
                                          </div>
                                        </Card.Body>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        })}
                      </Accordion>
                    </>
                      :
                      <></>
                  }
                </li>
              </ul>
              <div className={`sidebar-details ${isOpenProductDetail ? 'open' : 'closed'}`} id="sidebarDetails">
                <button id="back-button" className="back-button btn btn-secondary " onClick={openProductDetail} style={{ pointerEvents: 'auto' }}>Geri</button>
                <div className="product-detail" style={{ pointerEvents: 'none' }}>
                  <img src="bisiklet.jpg" alt="Ürün Resmi" className="product-image" />
                  <div className="product-text" style={{ pointerEvents: 'none' }}>
                    <h3 className="text-lg font-bold">15 Jant Kız Bisikleti Pembe</h3>
                    <p>Fiyat: 1.970,00 TL</p>
                    <div className="row button-group" style={{ pointerEvents: 'none' }}>
                      <button className="col-6 btn btn-primary me-2" style={{ pointerEvents: 'auto' }}>Ürüne Git</button>
                      <button className="col-6 btn btn-success" style={{ pointerEvents: 'auto' }}>Ürün Detayı</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

                <h1 className="display-4 mb-4 text-left">Hoş Geldiniz!</h1>
                <h2 className="display-5 mb-2 text-left">Farklı Bir E-Ticaret Deneyimi</h2>
                <h3 className="h5 mb-2 text-left">Ürün Arama ve Bulma İşlemleri</h3>
                <p className="lead text-left">Sitenin amacı: Kullanıcılara farklı bir e-ticaret deneyimi yaşatmaya çalışıyoruz. Burada e-ticaret sitesi ile konularak ürün arama ve bulma işlemi yapacaklar.</p>
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
          </div>

          <div className="chat-input">
            <span className="icon">📎</span>
            <span className="icon">🎥</span>
            <span className="icon">🌐</span>
            <input type="text" placeholder="ChatGPT uygulamasına ileti gönder" />
            <button>🎤</button>
          </div>

        </div>



        <BootstrapModal
          show={isModalOpen}
          onHide={closeModal}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <BootstrapModal.Header closeButton>
            <BootstrapModal.Title id="example-modal-sizes-title-lg">Modal Başlığı</BootstrapModal.Title>
          </BootstrapModal.Header>
          <BootstrapModal.Body>Bu bir örnek modal içeriğidir.</BootstrapModal.Body>
          <BootstrapModal.Footer>
            <Button variant="secondary" onClick={closeModal}>Kapat</Button>
          </BootstrapModal.Footer>
        </BootstrapModal>

      </Container>
    </>
  )
}

