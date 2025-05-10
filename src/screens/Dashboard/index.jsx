import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, InputGroup, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import Select from "react-select";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { Outlet, Link } from "react-router-dom"

import { updateProfile } from "../../api/profile/profileSlicer"
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import BuisnessPackageModal from "../../components/Modals/BuisnessPackageModal";
import LogoImageUploader from "../../components/LogoImageUploader";
export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  return (
    <>
      <div className="dashboard-layout">
        {/* Sol Menü */}
        <aside className="dashboard-sidebar">
          <ul className="dashboard-menu">
            <li><Link to="/dashboard" >Ana Sayfa</Link></li>
            <li><Link to="/dashboard/bids" >Talepler</Link></li>
            <li><Link to="/dashboard/products" >Ürünler</Link></li>
            <li><Link to="/dashboard/services" >Hizmetler</Link></li>
            <li><Link to="/dashboard/forms" >Formlar</Link></li>
            <li><Link to="/dashboard/settings" >Ayarlar</Link></li>
          </ul>
        </aside>
        {/* İçerik Alanı */}
        <Outlet />
      </div>
    </>
  );
}