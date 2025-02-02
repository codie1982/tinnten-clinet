import React from 'react'

export default function Detail() {
    return (
        
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
    )
}
