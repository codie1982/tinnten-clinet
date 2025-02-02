import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Button, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../../context/authContext'
export default function ProductCard({ product, openDetail }) {

    return (
        <Card className="product-card" key={product.product_name}>
            <div className="product-image-container">
                <Card.Img variant="bottom" src={product.product_image} alt={product.product_name} />
            </div>
            <Card.Body className="product-info">
                <Card.Text>{product.product_name}</Card.Text>
                <Card.Text>{product.product_price}</Card.Text>
                <Card.Text>{product.product_brand}</Card.Text>
                <Card.Text>Ücretsiz gönderim</Card.Text>
                <div className="button-group">
                    <Button variant="info" className="product-detail-button" onClick={openDetail}>Detaylar</Button>
                    <Button variant="primary" className="go-to-product-button">Git</Button>
                </div>
            </Card.Body>
        </Card>
    )
}
