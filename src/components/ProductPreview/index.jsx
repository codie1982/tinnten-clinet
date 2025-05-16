import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Row,Col,Carousel,Card,CloseButton } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import useChat from '../../hooks/useChat'
import { addFavorite, resetProduct } from '../../api/product/productSlicer';

export default function ProductPreview({
    title,
    gallery,
    basePrice,
    redirectUrl,
    description,
    attributes = [],
    showClose = false,
    onClose,
  }) {
    const [imageIndex, setImageIndex] = useState(0);
  
    const handleImageSelect = (selectedIndex) => {
      setImageIndex(selectedIndex);
    };
  
    const original = basePrice?.originalPrice || 0;
    const discount = basePrice?.discountRate || 0;
    const currency = basePrice?.currency || "TL";
    const finalPrice = (original - (original * discount) / 100).toFixed(2);
  
    return (
      <div className="product-detail preview-box p-3">
        {showClose && (
          <div className="d-flex justify-content-end">
            <CloseButton onClick={onClose} />
          </div>
        )}
  
        <Row>
          <Col className="image-section">
            <Carousel activeIndex={imageIndex} indicators={false} controls={false} data-bs-theme="dark">
              {gallery?.images?.map((item, idx) => (
                <Carousel.Item key={item.path || idx}>
                  <img className="d-block w-100" src={item.path} alt={`image-${idx}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
  
        {gallery?.images?.length > 1 && (
          <Row>
            <Col>
              <ul className="product-detail-image-list d-flex mt-2">
                {gallery.images.map((item, index) => (
                  <li key={index} className={index === imageIndex ? "active" : ""}>
                    <img
                      src={item.path}
                      className="product-image"
                      onClick={() => handleImageSelect(index)}
                      style={{ cursor: "pointer", width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                    />
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        )}
  
        <Row>
          <Col className="info-section mt-3">
            <h4>{title || "Ürün Başlığı"}</h4>
  
            <div className="price-display">
              {discount > 0 && (
                <p className="price" style={{ textDecoration: "line-through", fontSize: "0.9rem", color: "#ccc" }}>
                  {original.toFixed(2)} {currency}
                </p>
              )}
              <p className="bestprice fw-bold" style={{ fontSize: "1.4rem" }}>
                {finalPrice} {currency}
              </p>
            </div>
  
            {redirectUrl && (
              <div className="product-detail-action-section mb-3">
                <Link to={redirectUrl} className="btn btn-outline-primary btn-sm">
                  Siteye Git
                </Link>
              </div>
            )}
          </Col>
        </Row>
  
        <ul className="product-detail-saller-list">
          <li>
            <Row>
              <Col>
                <div className="product-detail-saller-content">
                  <div className="product-detail-saller-content-title fw-bold">Açıklama:</div>
                  <div className="product-detail-saller-content-description">{description || "-"}</div>
  
                  {attributes.length > 0 && (
                    <>
                      <hr />
                      <div className="fw-bold">Özellikler</div>
                      <ul className="list-unstyled">
                        {attributes.map((attr, idx) => (
                          <li key={idx}>
                            <strong>{attr.name}:</strong> {attr.value}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </li>
        </ul>
      </div>
    );
  }
