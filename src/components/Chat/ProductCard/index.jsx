import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate,Link, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Button, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../../context/authContext'

export default function ProductCard({ product, openDetail }) {

    return (
        <Card className="product-card" key={product.product_name}>
            <div className="product-image-container">
                <Card.Img variant="bottom" src={product.gallery.images[0].path} alt={product.description} />
            </div>
            <Card.Body className="product-info">
                <Card.Text>{product.title}</Card.Text>
                <Card.Text>{product.basePrice?.discountedPrice} {product.basePrice?.currency}</Card.Text>
                <Card.Text>{"Satıcı : "} {"Migros"}</Card.Text>
                <div className="product-button-group">
                    <Button variant="info" className="product-detail-button" onClick={openDetail}>Detaylar</Button>
                    <Link to={`${product.redirectUrl[0]}`} target='_blank' variant="primary" className="product-button-link">Git</Link>
                </div>
            </Card.Body>
        </Card>
    )
}
