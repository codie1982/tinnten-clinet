import React from 'react'
import { CloseButton } from 'react-bootstrap'
import FavoriteProductItem from '../../components/FavoriteProductItem'

export default function Favorite({ isOpenFavorite, closeFavoriteSection }) {
    return (
        <div className={`product-favorite ${isOpenFavorite ? '' : 'hidden'}`}>
            <div className={`product-favorite-content ${isOpenFavorite ? '' : 'hidden'}`}>
                <div className="product-favorite-header">
                    <CloseButton className="favorite-header-close-button" onClick={closeFavoriteSection} />
                </div>
                <ul>
                    <FavoriteProductItem />
                </ul>
            </div>
        </div>
    )
}
