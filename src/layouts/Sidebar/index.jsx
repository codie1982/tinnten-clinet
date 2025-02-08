import React, { useState } from 'react'
import { Link } from "react-router-dom";
import logo_text_transparent from "../../assets/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShoppingCart, faEllipsisV,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import logo from "../../assets/logo.png"
import { Button, Modal, Dropdown, DropdownButton, } from 'react-bootstrap'
import FeaturesPrice from "../../components/Modals/FeaturesPriceModal"
export default function Sidebar({ resetAll,openSidebar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);




  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  return (
    <div className={`sidebar ${openSidebar ? "open" : "closed"}`}>
      <div className={`sidebar-content ${openSidebar ? "" : "closed"}`}>
        <div className='site-logo-container'>
          <div className="site-logo">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
        <div className="chat-release">
          <button onClick={resetAll}>Konuşmayı yenile</button>
        </div>
        <div className="history-title">
          <h3>Arama Geçmişi</h3>
        </div>
        <div className="history-input">
          <input type="text" placeholder="Geçmiş" />
          <span><FontAwesomeIcon icon={faSearch} /></span>
        </div>
        <ul className={`search-history `}>
          <li>
            <a href="#">Arama 1</a>
            <DropdownButton className={`filter-dropdown-button`} id="dropdown-item-button"
              key={""}
              title={""}>
              <Dropdown.Item
                className={`filter-dropdown-button-item`} // Seçiliyse 'selected' sınıfını ekle
                as="button"
              >
                {"Yeniden Adlandır"}
              </Dropdown.Item>
              <Dropdown.Item
                className={`filter-dropdown-button-item`} // Seçiliyse 'selected' sınıfını ekle
                as="button"
              >
                {"Paylaş"}
              </Dropdown.Item>
              <Dropdown.Item
                className={`filter-dropdown-button-item`} // Seçiliyse 'selected' sınıfını ekle
                as="button"
              >
                {"Aramayı sil"}
              </Dropdown.Item>
            </DropdownButton>
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

      <FeaturesPrice isModalOpen={isModalOpen} setIsModalOpen={openModal} />
    </div>
  )
}
