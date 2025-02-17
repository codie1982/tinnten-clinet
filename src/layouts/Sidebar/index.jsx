import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo.png';
import FeaturesPrice from '../../components/Modals/FeaturesPriceModal';
import RenameHistoryModal from '../../components/Modals/RenameHistoryModal';
import HistorySearchModal from '../../components/Modals/HistorySearchModal';

export default function Sidebar({ setConversation, openSidebar }) {
  const MAXITEM = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isHistorySearchOpen, setIsHistorySearchOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const { isSuccess, isError, isLoading, historyies } = useSelector(state => state.conversation);
  const location = useLocation();

  useEffect(() => {
    console.log('Sayfa yüklendi:', location.pathname.split('/').pop());
  }, [location]);

  useEffect(() => {
    if (!isLoading && isSuccess && historyies?.size !== 0) {
      setHistoryList(historyies);
    }
  }, [isSuccess, isError, isLoading, historyies]);

  const toggleModal = () => setIsModalOpen(prev => !prev);
  const toggleRenameModal = () => setIsRenameModalOpen(prev => !prev);
  const toggleHistorySearchModal = () => setIsHistorySearchOpen(prev => !prev);

  return (
    <div className={`sidebar ${openSidebar ? 'open' : 'closed'}`}>
      <div className={`sidebar-content ${openSidebar ? '' : 'closed'}`}>
        <div className="site-logo-container">
          <div className="site-logo">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>

        <div className="chat-release">
          <button onClick={() => setConversation()}>Konuşmayı yenile</button>
        </div>

        <div className="history-title">
          <h3>Arama Geçmişi</h3>
        </div>

        <div className="history-input">
          <input type="text" placeholder="Geçmiş" onClick={toggleHistorySearchModal} />
          <span>
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>

        <ul className="search-history">
          {historyList?.slice(0, showAll ? historyList.length : MAXITEM).map((history, index) => (
            <Link
              key={index}
              className="search-history-item"
              to={`/conversation/${history.conversationid}`}
              onClick={() => setConversation(history.conversationid)}
            >
              <li>
                <span>
                  {history.title === ''
                    ? `${history.conversationid.substring(0, 15)}...`
                    : history.title}
                </span>
                <span>
                  <DropdownButton
                    className="filter-dropdown-button"
                    id="dropdown-item-button"
                    title=""
                  >
                    <Dropdown.Item
                      className="filter-dropdown-button-item"
                      as="button"
                      onClick={toggleRenameModal}
                    >
                      Yeniden Adlandır
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="filter-dropdown-button-item"
                      as="button"
                    >
                      Aramayı sil
                    </Dropdown.Item>
                  </DropdownButton>
                </span>
              </li>
            </Link>
          ))}

          {historyList?.length > MAXITEM && (
            <div className="search-history-all-see" onClick={() => setShowAll(prev => !prev)}>
              <span>{showAll ? 'Daha Az Gör' : 'Tümünü Gör'}</span>
            </div>
          )}
        </ul>

        <div
          className="plan-features align-items-center justify-content-between"
          onClick={toggleModal}
        >
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

      <FeaturesPrice isModalOpen={isModalOpen} setIsModalOpen={toggleModal} />
      <RenameHistoryModal isModalOpen={isRenameModalOpen} setIsModalOpen={toggleRenameModal} />
      <HistorySearchModal isModalOpen={isHistorySearchOpen} setIsModalOpen={toggleHistorySearchModal} />
    </div>
  );
}
