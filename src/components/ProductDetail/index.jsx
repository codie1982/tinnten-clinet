import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Row, Col, Button, CloseButton, Carousel } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { addFavorite,resetProduct } from '../../features/product/productSlicer';

export default function ProductDetail({ openDetail }) {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")
    const [cookies, setCookie] = useCookies(['name']);

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    const addFavoriteProduct = () => {
        console.log("addFavoriteProduct")
        dispatch(resetProduct())
        dispatch(addFavorite({ id: 1 }))
    }

    return (
        <div className="product-detail">
            <div className="product-detail-header-content">
                <div className="product-detail-header">
                    <div className="icon">Ürün Detayı</div>
                    <div className="close-button"><CloseButton onClick={openDetail} /></div>
                </div>
            </div>
            <Row>
                <Col className="image-section">
                    <Carousel activeIndex={index} indicators={false} controls={false} data-bs-theme="dark">
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg"
                                alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg"
                                alt="Second slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg"
                                alt="Third slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ul className="product-detail-image-list">
                        <li className='active'>
                            <img
                                src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg"
                                alt="Rockrider Expl 50"
                                className="product-image"
                                onClick={() => { handleSelect(0) }}
                            />
                        </li>
                        <li>
                            <img
                                src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg"
                                alt="Rockrider Expl 50"
                                className="product-image"
                                onClick={() => { handleSelect(1) }}
                            />
                        </li>
                        <li>
                            <img
                                src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg"
                                alt="Rockrider Expl 50"
                                className="product-image"
                                onClick={() => { handleSelect(2) }}
                            />
                        </li>

                    </ul>
                </Col>
            </Row>
            <Row>
                <Col className="info-section">
                    <h3>Rockrider Expl 50 27,5 İnç Fren Dağ Bisikleti</h3>
                    <p className="rating">⭐ 4.4/5 (101 kullanıcı yorumu)</p>
                    <p className="price">₺16.990,00</p>
                    <Row>
                        <Col> <Button variant="primary" className="product-detail-go-button">Siteye Git</Button></Col>
                        <Col> <Button variant="primary" onClick={addFavoriteProduct} className="product-detail-add-favorite-button">Kaydet</Button></Col>
                    </Row>
                </Col>
            </Row>
            <ul className='product-detail-saller-list'>
                <li>
                    <Row>
                        <Col>
                            <div className="product-detail-saller-content">
                                <div className="product-detail-saller-content-header">
                                    <div className="header-text">Satıcı Bilgileri</div>
                                    <div className="title">Migros</div>
                                    <div className="price">₺16.990,00</div>
                                </div>
                                <div className="product-detail-saller-content-description">Decathlon Rockrider Expl 50 27,5 Inç Jant V Fren Fren Açık Gri Dağ Bisikleti</div>
                                <div className="product-detail-saller-content-description">Ücretsiz teslimat·60 gün içinde ücretsiz iade || Stokta olup olmadığını öğrenmek için iletişime geçin</div>
                            </div>
                        </Col>
                    </Row>
                </li>
            </ul>
        </div>
    )
}
/**
 * 
Decathlon
₺16.990,00

Online stokta
Ücretsiz teslimat·60 gün içinde ücretsiz iade·Stokta olup olmadığını öğrenmek için iletişime geçin·22,8 km
Taban fiyat
₺16.990,00
Teslimat ücreti
Ücretsiz
Toplam
₺16.990,00
 */
