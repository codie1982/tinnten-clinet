import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, InputGroup, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import { useModal } from '../../components/Modals/ModalProvider'
export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  return (
    <>
      <main className="dashboard-content">
        <div className="form-header">
          <h2 className="form-title">Uygulama Yönetim Ekranı</h2>
          <p className="form-description">
            Uygulamayı yönetmek ve sistem ayarlarını düzenlemek için buradan kullanıcı bilgilerini,
            uygulama verilerini ve genel durumu takip edebilirsiniz.
          </p>
        </div>

        {/* Kartlar */}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Toplam Firma</h3>
            <p>123</p>
          </div>
          <div className="dashboard-card">
            <h3>Ürün Sayısı</h3>
            <p>432</p>
          </div>
          <div className="dashboard-card">
            <h3>Hizmet Sayısı</h3>
            <p>89</p>
          </div>
        </div>
      </main>
    </>
  );
}