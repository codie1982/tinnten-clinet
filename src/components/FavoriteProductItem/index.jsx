import React from 'react';

export default function FavoriteProductItem() {
    return (
        <li className='product-favorite-list'>
            <div className="product-favorite-item">
                <div className="product-favorite-image">
                    <img src="https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg" alt="" />
                </div>
                <div className="product-favorite-info">
                    <h4>Ürün Adı</h4>
                    <p>Ürün Açıklaması</p>
                </div>
                <div className="product-favorite-action">
                    <button className="product-favorite-remove">Sil</button>
                </div>
            </div>
        </li>
    )

}
