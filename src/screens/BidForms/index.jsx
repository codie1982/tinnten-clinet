import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, Carousel, Spinner, Table } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import Select from "react-select";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import ImageGalleryUploader from "../../components/ImageGalleryUploader";
import { getForms, deleteForm, resetForm } from "../../api/form/dynamicFormSlicer";
import UpdateFormBuilderModal from "../../components/Modals/UpdateFormBuilderModal";
import { toast } from 'react-toastify';

const COMPANYID = "6824aace3bd66ed798e41bbb";
export default function BidForms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useModal();
  const [selectedFormId, setSelectedFormId] = useState('');

  // Access form slice state
  const { formList, isLoading, isSuccess, isError, message, operation } = useSelector((state) => state.dynamicform);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 5;

  // Get company ID from user (assuming user.companyid exists)
  const companyId = COMPANYID || ''; // Replace COMPANYID with dynamic value

  // Fetch forms on mount or when companyId changes
  useEffect(() => {
    if (companyId) {
      dispatch(getForms({ companyid: companyId }));
    }
  }, [dispatch, companyId]);

  // Handle success and error notifications
  useEffect(() => {
    if (isSuccess && operation) {
      toast.success(`Operation ${operation} successful!`);
      if (operation === 'deleteForm') {
        // dispatch(getForms({ companyid: companyId })); // Refresh form list after delete
      }
    }
    if (isError && message) {
      toast.error(`Error in ${operation}: ${message}`);
    }
  }, [isSuccess, isError, message, operation, dispatch, companyId]);


  // Handle form deletion
  const handleDelete = (formId) => {
    if (window.confirm('Formu silmek istediğinize emin misiniz?')) {
      dispatch(deleteForm({ companyid: companyId, formid: formId }));
    }
  };

  // Pagination calculations
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formList?.slice(indexOfFirstForm, indexOfLastForm) || [];
  const totalPages = Math.ceil((formList?.length || 0) / formsPerPage);

  return (
    <main className="dashboard-content">
      <div className="form-header">
        <h2 className="form-title">Formlar</h2>
        <p className="form-description">
          Teklif Formlarınızı buradan yönetebilir, yeni formlar ekleyebilir ve mevcut formlarınızı güncelleyebilirsiniz.
        </p>
      </div>
      <UpdateFormBuilderModal
        companyid={companyId}
        formid={selectedFormId}
        onRefresh={() => {
          dispatch(getForms({ companyid: companyId }))
        }}
      />
      <Row>
        <Col className="text-end mb-3">
          <Button variant="success" onClick={() => navigate('/dashboard/forms/add')}>
            Yeni Form
          </Button>
        </Col>
      </Row>

      <Table className="table table-dark table-striped table-bordered align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Form Adı</th>
            <th>Açıklama</th>
            <th>Alan Sayısı</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center">
                <Spinner animation="border" variant="light" />
              </td>
            </tr>
          ) : currentForms.length > 0 ? (
            currentForms.map((form, index) => (
              <tr key={form._id}>
                <td>{indexOfFirstForm + index + 1}</td>
                <td>{form.formName}</td>
                <td>{form.description}</td>
                <td>{form.fields?.length || 0}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    className="me-2"
                    onClick={() => {
                      setSelectedFormId(form._id);
                      openModal("updateFormModal");
                    }}
                  >
                    Güncelle
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(form._id)}>
                    Kaldır
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Kayıtlı form bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <nav aria-label="Sayfalama" className="d-flex justify-content-center">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Önceki
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sonraki
              </button>
            </li>
          </ul>
        </nav>
      )}


    </main>
  );
}


