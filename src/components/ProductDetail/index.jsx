import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Row, Col, Button, CloseButton, Carousel } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import { addFavorite, resetProduct } from '../../api/product/productSlicer';

export default function ProductDetail({ product, openDetail,closeDetail }) {
    const dispatch = useDispatch()
    const [t, i18n] = useTranslation("global")
    const [cookies, setCookie] = useCookies(['name']);
    const { isLogin, isLoading, user } = useAuth();
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    const addFavoriteProduct = () => {
        console.log("addFavoriteProduct")
        dispatch(resetProduct())
        dispatch(addFavorite({ id: 1 }))
    }


    if (isLogin && product != null)
        return (
            <div className="product-detail">
                <div className="product-detail-header-content">
                    <div className="product-detail-header">
                        <div className="icon">Ürün Detayı</div>
                        <div className="close-button"><CloseButton onClick={closeDetail} /></div>
                    </div>
                </div>
                <Row>
                    <Col className="image-section">
                        <Carousel activeIndex={index} indicators={false} controls={false} data-bs-theme="dark">
                            {product.gallery.images.map((item) => {
                                return (
                                    <Carousel.Item key={item.path}>
                                        <img
                                            className="d-block w-100"
                                            src={`${item.path}`}
                                        />
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ul className="product-detail-image-list">
                            {product.gallery.images.map((item, index) => {
                                return (
                                    <li className='active'>
                                        <img
                                            src={`${item.path}`}
                                            className="product-image"
                                            onClick={() => { handleSelect(index) }}
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col className="info-section">
                        <h3>{product.title}</h3>
                        {/* <p className="rating">⭐ 4.4/5 (101 kullanıcı yorumu)</p> */}
                        <p className="price">{product.basePrice.originalPrice} {product.basePrice.currency}</p>
                        <p className="bestprice">{product.basePrice.discountedPrice} {product.basePrice.currency}</p>
                        <div className="product-detail-action-section">
                            <Link to={`${product.redirectUrl[0]}`} variant="primary" className="product-detail-go-button">Siteye Git</Link>
                            {/* <Button variant="primary" onClick={addFavoriteProduct} className="product-detail-add-favorite-button">Kaydet</Button> */}
                        </div>
                    </Col>
                </Row>
                <ul className='product-detail-saller-list'>
                    <li>
                        <Row>
                            <Col>
                                <div className="product-detail-saller-content">
                                    {/* <div className="product-detail-saller-content-header">
                                        <div className="header-text">Satıcı Bilgileri</div>
                                        <div className="title">Migros</div>
                                        <div className="price">₺16.990,00</div>
                                    </div> */}
                                    <div className="product-detail-saller-content-title">Açıklama : </div>
                                    <div className="product-detail-saller-content-description">{product.description}</div>
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
