import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/logo.png';
import FeaturesPrice from '../../components/Modals/FeaturesPriceModal';
import RenameHistoryModal from '../../components/Modals/RenameHistoryModal';
import DeleteConversationModal from '../../components/Modals/DeleteConversationModal';
import HistorySearchModal from '../../components/Modals/HistorySearchModal';
import { useTranslation } from "react-i18next";

import {
  getConversationHistory,
  conversationRename,
  resetUpdateHistory,
  deleteConversationThunk,
  searchConversationThunk
} from "../../api/conversation/conversationSlicer";

export default function Sidebar({ setConversation, openSidebar }) {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const LIMIT = 5;

  const [modals, setModals] = useState({
    features: false,
    rename: false,
    delete: false,
    historySearch: false,
  });

  const [historyList, setHistoryList] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState({});
  const [page, setPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [searchConversationResult, setSearchResults] = useState([])
  const SEARCHLIMIT = 10;
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [firstSearch, setFirstSearch] = useState(true);
  const {
    isHistorySuccess,
    isHistoryLoading,
    history: historyData,
    updateHistory,
    deleteHistory,
    searchResults,
    isSearchError,
    isSearchSuccess,
    isSearchLoading,

  } = useSelector(state => state.conversation);

  const location = useLocation();

  useEffect(() => {
    dispatch(getConversationHistory({ page: 1, limit: LIMIT }));
  }, [dispatch]);

  const getMoreHistory = () => {
    if (isFetchingMore || !hasMoreHistory) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    dispatch(getConversationHistory({ page: nextPage, limit: LIMIT }))
      .then(() => {
        setPage(nextPage);
      })
      .finally(() => {
        setIsFetchingMore(false);
      });
  };

  useEffect(() => {
    if (isHistorySuccess && historyData?.history?.length > 0) {
      setHistoryList(prev => [...prev, ...historyData.history]);
      if (historyData.history.length < LIMIT) setHasMoreHistory(false);
    }
  }, [isHistorySuccess, historyData]);

  useEffect(() => {
    if (updateHistory?.conversationid) {
      setHistoryList(prev =>
        prev.map(item =>
          item.conversationid === updateHistory.conversationid
            ? { ...item, title: updateHistory.title }
            : item
        )
      );
      dispatch(resetUpdateHistory());
    }
  }, [updateHistory, dispatch]);

  useEffect(() => {

    if (!isSearchLoading && isSearchSuccess && searchResults?.length > 0) {
      if (searchResults.length < SEARCHLIMIT) setHasMoreResults(false);
      if(firstSearch) {
        setSearchResults(searchResults); // ilk arama sonuçlarını ayarla
      } else {
        setSearchResults(prev => [...prev, ...searchResults]); // sonuçları birleştir
      }
    }
  }, [searchResults,
    isSearchError,
    isSearchSuccess,
    isSearchLoading])



  useEffect(() => {
    if (deleteHistory?.conversationid) {
      setHistoryList(prev =>
        prev.filter(item => item.conversationid !== deleteHistory.conversationid)
      );
    }
  }, [deleteHistory, dispatch]);

  const handleRename = (e) => {
    e.preventDefault();
    const newTitle = e.target.elements.title.value;
    dispatch(conversationRename({
      title: newTitle,
      conversationid: selectedHistory.conversationid
    }));
    setModals(prev => ({ ...prev, rename: false }));
  };

  const toggleModal = (name, value = null) => {
    setModals(prev => ({
      ...prev,
      [name]: value !== null ? value : !prev[name]
    }));
  };

  const deleteConversation = (historyItem) => {
    setSelectedHistory(historyItem);
    toggleModal("delete", true);
  };
  const handleConfirmDelete = () => {
    if (selectedHistory?.conversationid) {
      // Burada redux dispatch çağrısı yapılır
      dispatch(deleteConversationThunk({ conversationid: selectedHistory.conversationid }));
      // Listedeki itemı da lokal olarak silebiliriz
      setHistoryList(prev => prev.filter(h => h.conversationid !== selectedHistory.conversationid));
      toggleModal("delete", false);
    }
  };

  const handleSearch = (searchText, page, limit,first) => {
    if (searchText) {
      setFirstSearch(first);
      // Burada redux dispatch çağrısı yapılır
      dispatch(searchConversationThunk({ query: searchText, page, limit }));
      //toggleModal("historySearch", false);
    }
  };
  const onSelectedItem = (item) => {
    console.log("item", item)
  };
  return (
    <div className={`sidebar ${openSidebar ? 'open' : 'closed'}`}>
      <div className={`sidebar-content ${openSidebar ? '' : 'closed'}`}>
        <div className="site-logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="chat-release">
          <button onClick={() => setConversation()}>{t("sidebar.reconversation")}</button>
        </div>

        <div className="history-title">
          <h3>{t("sidebar.history")}</h3>
        </div>

        <div className="history-input">
          <input
            type="text"
            placeholder={t("sidebar.searchPlaceholder") || "Geçmiş"}
            onClick={() => toggleModal("historySearch")}
          />
          <span><FontAwesomeIcon icon={faSearch} /></span>
        </div>

        <ul className="search-history">
          {historyList.map((history, index) => (
            <li key={index} className="search-history-item">
              <div className="d-flex justify-around align-items-center w-100">
                <Link
                  to={`/conversation/${history.conversationid}`}
                  onClick={() => setConversation(history.conversationid)}
                  className="history-link"
                >
                  <span>{history.title || `${history.conversationid.substring(0, 15)}...`}</span>
                </Link>
                <DropdownButton
                  className="filter-dropdown-button"
                  id={`dropdown-item-button-${index}`}
                  title=""
                  onClick={e => e.stopPropagation()}
                >
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHistory(history);
                      toggleModal("rename", true);
                    }}
                  >
                    {t("sidebar.rename")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(history);
                    }}
                  >
                    {t("sidebar.removesearch")}
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </li>
          ))}

          {isHistoryLoading && (
            <div className="d-flex justify-center align-middle w-auto">
              <Spinner animation="border" variant="dark" className="loading-spinner" />
            </div>
          )}

          {hasMoreHistory && !isHistoryLoading && (
            <div className="search-history-all-see" onClick={getMoreHistory}>
              <span>{t("sidebar.seeMore") || "Daha fazla Gör"}</span>
            </div>
          )}
        </ul>




      </div>

      <FeaturesPrice isModalOpen={modals.features} setIsModalOpen={() => toggleModal("features")} />
      <RenameHistoryModal
        isModalOpen={modals.rename}
        setIsModalOpen={() => toggleModal("rename")}
        title={selectedHistory.title}
        handleRename={handleRename}
      />
      <DeleteConversationModal
        isModalOpen={modals.delete}
        setIsModalOpen={() => toggleModal("delete")}
        onConfirm={handleConfirmDelete}
      />
      <HistorySearchModal
        isModalOpen={modals.historySearch}
        setIsModalOpen={() => toggleModal("historySearch")}
        onSearch={handleSearch}
        results={searchConversationResult}
        onSelectedItem={onSelectedItem}
        isSearchLoading={isSearchLoading}
        hasMoreResults={hasMoreResults}
        searchLimit={SEARCHLIMIT}
      />
    </div>
  );
}