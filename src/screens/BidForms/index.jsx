import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, Carousel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import Select from "react-select";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import ImageGalleryUploader from "../../components/ImageGalleryUploader";

export default function BidForms() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  return (
    <main className="dashboard-content">
      <div className="form-header">
        <h2 className="form-title">Formlar</h2>
        <p className="form-description">
          Teklif Formlarınızı buradan yönetebilir, yeni formlar ekleyebilir ve mevcut formlarınızı güncelleyebilirsiniz.
          <br />
        </p>
      </div>
      <Row>
        <Col>
          <div className="text-end mb-3">
            <Button type="submit" variant="success" onClick={() => { navigate("/dashboard/forms/add") }}>Yeni Form</Button>
          </div></Col>
      </Row>
      <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0">Ürünler Listesi</h4>
          <nav aria-label="Sayfalama">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1">Önceki</a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">Sonraki</a>
              </li>
            </ul>
          </nav>
        </div>

        <table class="table table-dark table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Görsel</th>
              <th scope="col">Ürün Adı</th>
              <th scope="col">Kategori</th>
              <th scope="col">Fiyat</th>
              <th scope="col">Stok</th>
              <th scope="col">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>
                <img src="https://via.placeholder.com/60" class="img-thumbnail" alt="Ürün Resmi" width="60" height="60" />
              </td>
              <td>Akıllı Saat</td>
              <td>Elektronik</td>
              <td>₺1.299</td>
              <td>25</td>
              <td>
                <button class="btn btn-sm btn-primary me-2">Güncelle</button>
                <button class="btn btn-sm btn-danger">Kaldır</button>
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>
                <img src="https://via.placeholder.com/60" class="img-thumbnail" alt="Ürün Resmi" width="60" height="60" />
              </td>
              <td>Bluetooth Kulaklık</td>
              <td>Elektronik</td>
              <td>₺499</td>
              <td>78</td>
              <td>
                <button class="btn btn-sm btn-primary me-2">Güncelle</button>
                <button class="btn btn-sm btn-danger">Kaldır</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}


