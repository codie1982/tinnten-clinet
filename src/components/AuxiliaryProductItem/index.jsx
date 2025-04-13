import React from 'react';
import { Button, Card } from 'react-bootstrap'
import { useNavigate, Link, } from "react-router-dom";

export default function AuxiliaryProductItem({ product, openDetail }) {
    return (
        <div className="product-auxiliary-item">
            <div className="product-auxiliary-image">
                <img src={`${product.gallery.images[0].path}`} alt="" />
            </div>
            <div className="product-auxiliary-info">
                <h4>{product.title}</h4>
                <p>{product.basePrice.discountedPrice} - {product.basePrice.currency}</p>
            </div>
            <div className="product-auxiliary-action">
                <Button variant="info" className="product-detail-button" onClick={()=>{openDetail(product._id)}}>Detaylar</Button>
                <Link to={`${"product?.redirectUrl[0]"}`} variant="primary" className="product-button-link">Git</Link>
            </div>

        </div>
    )

}
