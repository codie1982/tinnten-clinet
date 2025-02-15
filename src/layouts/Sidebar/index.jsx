import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import logo_text_transparent from "../../assets/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShoppingCart, faEllipsisV,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import logo from "../../assets/logo.png"
import { Button, Modal, Dropdown, DropdownButton, } from 'react-bootstrap'
import FeaturesPrice from "../../components/Modals/FeaturesPriceModal"
import RenameHistoryModal from '../../components/Modals/RenameHistoryModal';
import HistorySearchModal from '../../components/Modals/HistorySearchModal';
import { deleteConversition, changeConversitionName } from "../../api/conversation/conversationSlicer"


export default function Sidebar({ startNewconversation, openSidebar }) {
  const MAXITEM = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenRenameHistory, setIsOpenRenameHistory] = useState(false)
  const [isHistorySearch, setIsHistorySearch] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [allSee, setAllSee] = useState(false)
  const { isSuccess, isError, isLoading, historyies } = useSelector(
    (state) => {
      return state.conversation
    }
  )

  useEffect(() => {
    if (!isLoading)
      if (isSuccess)
        if (historyies?.size != 0)
          setHistoryList(historyies)
  }, [isSuccess, isError, isLoading, historyies])



  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openRenameHistoryModal = () => {
    setIsOpenRenameHistory(!isOpenRenameHistory)
  }

  const openHistorySearchModal = () => {
    setIsHistorySearch(!isHistorySearch)
  }

  return (
    <div className={`sidebar ${openSidebar ? "open" : "closed"}`}>
      <div className={`sidebar-content ${openSidebar ? "" : "closed"}`}>
        <div className='site-logo-container'>
          <div className="site-logo">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
        <div className="chat-release">
          <button onClick={startNewconversation}>Konuşmayı yenile</button>
        </div>
        <div className="history-title">
          <h3>Arama Geçmişi</h3>
        </div>
        <div className="history-input">
          <input type="text" placeholder="Geçmiş" onClick={() => { openHistorySearchModal() }} />
          <span><FontAwesomeIcon icon={faSearch} /></span>
        </div>
        <ul className={`search-history `}>
          {historyList?.slice(0, allSee ? historyList.length : MAXITEM).map((history, index) => (
            <li key={index} className='search-history-item'>
              <Link to={`/conversation/${history.id}`}>{history.title}</Link>
              <a href="#"></a>
              <DropdownButton className={`filter-dropdown-button`} id="dropdown-item-button"
                key={""}
                title={""}>
                <Dropdown.Item
                  className={`filter-dropdown-button-item`} // Seçiliyse 'selected' sınıfını ekle
                  as="button"
                  onClick={() => { openRenameHistoryModal() }}
                >
                  {"Yeniden Adlandır"}
                </Dropdown.Item>
                <Dropdown.Item
                  className={`filter-dropdown-button-item`} // Seçiliyse 'selected' sınıfını ekle
                  as="button"
                >
                  {"Aramayı sil"}
                </Dropdown.Item>
              </DropdownButton>
            </li>
          ))}

          {historyList?.length > MAXITEM && (
            <div className="search-history-all-see" onClick={() => setAllSee(!allSee)}>
              <span>{allSee ? "Daha Az Gör" : "Tümünü Gör"}</span>
            </div>
          )}

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
      <RenameHistoryModal isModalOpen={isOpenRenameHistory} setIsModalOpen={openRenameHistoryModal} />
      <HistorySearchModal isModalOpen={isHistorySearch} setIsModalOpen={openHistorySearchModal} />

    </div>
  )
}
