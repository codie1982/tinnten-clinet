import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Button, Dropdown, DropdownButton, Row, Col, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import Select from "react-select";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import ImageGalleryUploader from "../../components/ImageGalleryUploader";
import { getProducts } from "../../api/product/productSlicer"
import IsRemovePorductModal from "../../components/Modals/IsRemovePorductModal";
import UpdateProductModal from "../../components/Modals/UpdateProductModal";
import UpdateProductGalleryModal from "../../components/Modals/UpdateProductGalleryModal";
import UpdateProductPriceModal from "../../components/Modals/UpdateProductPriceModal";
import UpdateProductVariantModal from "../../components/Modals/UpdateProductVariantModal";
import UpdateProductRequestFormModal from "../../components/Modals/UpdateProductRequestFormModal";
const COMPANYID = "6824aace3bd66ed798e41bbb";
export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("global");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { openModal } = useModal()
  const [expandedRows, setExpandedRows] = useState([]);
  const productState = useSelector((state) => state.product || {});

  const { productList, isProductError, isProductSuccess, isLoading } = productState;

  const [priceIndexes, setPriceIndexes] = useState({}); // ürün ID'lerine göre aktif index tutulur
  const [selectedProductId, setselectedProductId] = useState("")

  useEffect(() => {
    console.log("productList", productList)
  }, [productList])

  useEffect(() => {
    dispatch(getProducts({ companyid: COMPANYID, page, limit }));
  }, [page]);

  useEffect(() => {
    console.log("Seçili Ürün ID'si", selectedProductId)
  }, [selectedProductId])

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(productList?.pagination?.total / limit)) {
      setPage(newPage);
    }
  };
  const toggleRow = (productId) => {
    setExpandedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePriceNav = (productId, direction, totalLength) => {
    setPriceIndexes((prev) => {
      const current = prev[productId] || 0;
      let nextIndex = direction === "next" ? current + 1 : current - 1;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= totalLength) nextIndex = totalLength - 1;
      return { ...prev, [productId]: nextIndex };
    });
  };
  return (
    <main className="dashboard-content">
      <div className="form-header">
        <h2 className="form-title">Ürünler</h2>
        <p className="form-description">
          Ürünlerinizi buradan yönetebilir, yeni ürün ekleyebilir ve mevcut ürünlerinizi güncelleyebilirsiniz.
        </p>
      </div>

      <Row>
        <Col className="text-end mb-3">
          <Button variant="success" onClick={() => navigate("/dashboard/products/add")}>
            Yeni Ürün
          </Button>
        </Col>
      </Row>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Ürünler Listesi</h4>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageClick(page - 1)}>
                  Önceki
                </button>
              </li>
              {Array.from({ length: productList?.pagination?.totalPages || 1 }, (_, idx) => (
                <li key={idx} className={`page-item ${page === idx + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageClick(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === productList?.pagination?.totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageClick(page + 1)}>
                  Sonraki
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <table className="table table-dark table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Görsel</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <div className="text-center">
                    <Spinner animation="border" variant="light" />
                  </div>
                </td>
              </tr>
            ) : (

              productList?.items?.length > 0 ? (
                productList?.items?.map((product, index) => {
                  const image = product?.gallery?.images?.[0]?.path || "https://via.placeholder.com/60";
                  const priceInfo = product.basePrice?.[0] || {};
                  const price = priceInfo.discountedPrice > 0 ? priceInfo.discountedPrice : priceInfo.originalPrice;
                  const currency = priceInfo.currency || "TL";
                  const isExpanded = expandedRows.includes(product._id);

                  return (
                    <React.Fragment key={product._id}>
                      <tr>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>
                          <img
                            src={image}
                            className="img-thumbnail"
                            alt="Ürün Resmi"
                            width="60"
                            height="60"
                          />
                        </td>
                        <td>{product.title}</td>
                        <td>{(product.categories || []).join(", ") || "-"}</td>
                        <td>
                          {product.pricetype == "fixed" ?
                            product.basePrice && product.basePrice.length > 0 ? (() => {
                              const sortedPrices = [...product.basePrice].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                              const currentIndex = priceIndexes[product._id] || 0;
                              const priceItem = sortedPrices[currentIndex];

                              const hasDiscount = priceItem.discountRate > 0 && priceItem.discountedPrice > 0;
                              const formattedDate = new Date(priceItem.createdAt).toLocaleDateString("tr-TR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              });

                              const showArrows = sortedPrices.length > 1;

                              return (
                                <div className="d-flex flex-column align-items-center">
                                  <div className="d-flex align-items-center">
                                    {showArrows && (
                                      <button
                                        className="btn btn-sm btn-outline-light me-1"
                                        onClick={() => handlePriceNav(product._id, "prev", sortedPrices.length)}
                                        disabled={currentIndex === 0}
                                      >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                      </button>
                                    )}

                                    <span className="fw-bold">
                                      {hasDiscount ? priceItem.discountedPrice : priceItem.originalPrice} {priceItem.currency}
                                    </span>

                                    {showArrows && (
                                      <button
                                        className="btn btn-sm btn-outline-light ms-1"
                                        onClick={() => handlePriceNav(product._id, "next", sortedPrices.length)}
                                        disabled={currentIndex === sortedPrices.length - 1}
                                      >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                      </button>
                                    )}
                                  </div>

                                  {hasDiscount ? (
                                    <small className="text-success">
                                      İndirim: {priceItem.originalPrice} → {priceItem.discountedPrice} ({priceItem.discountRate}%)
                                    </small>
                                  ) : (
                                    <small className="text-white">
                                      Net Fiyat: {priceItem.originalPrice} {priceItem.currency}
                                    </small>
                                  )}

                                  <small className="text-white">Tarih: {formattedDate}</small>
                                </div>
                              );
                            })() : "-" : "Teklif formu"}

                        </td>
                        <td>{product.variants?.length ?? "-"}</td>
                        <td>
                          <div className="d-flex align-items-stretch gap-2">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => toggleRow(product._id)}
                            >
                              {isExpanded ? "Kapat" : "Varyantlar"}
                            </button>

                            <DropdownButton
                              id={`dropdown-${product._id}`}
                              title="Güncelle"
                              variant="primary"
                              size="sm"
                              className="flex-grow-1"
                              onClick={() => { setselectedProductId(product._id) }}
                            >
                              <Dropdown.Item onClick={() => {
                                openModal("updateProduct")
                              }}>
                                Temel Bilgileri Güncelle
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => openModal("updateProductGallery")}>
                                Resimleri Güncelle
                              </Dropdown.Item>
                              {product.pricetype === "fixed" && (
                                <Dropdown.Item onClick={() => openModal("updateProductPrice")}>
                                  Fiyat Güncelle
                                </Dropdown.Item>
                              )}
                              {product.pricetype === "offer_based" && (
                                <Dropdown.Item onClick={() => openModal("updateProductRequestForm")}>
                                  İstek Formu Güncelle
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item onClick={() => openModal("updateProductVariant")}>
                                Varyantları Güncelle
                              </Dropdown.Item>
                            </DropdownButton>

                            <button className="btn btn-sm btn-danger" onClick={() => { openModal("isRemoveProduct") }}>
                              Kaldır
                            </button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="bg-dark-subtle">
                            <strong>Varyantlar:</strong>
                            <table className="table table-sm table-bordered table-dark mt-2">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Varyant ID</th>
                                  <th>Not</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants?.map((variantId, idx) => (
                                  <tr key={variantId}>
                                    <td>{idx + 1}</td>
                                    <td>{variantId}</td>
                                    <td>Ayrıntı eklenmedi</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Kayıtlı form bulunamadı.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <IsRemovePorductModal />
      <UpdateProductModal companyid={COMPANYID} productid={selectedProductId} onRefresh={() => { dispatch(getProducts({ companyid: COMPANYID, page, limit })) }} />
      <UpdateProductGalleryModal companyid={COMPANYID} productid={selectedProductId} onRefresh={() => { dispatch(getProducts({ companyid: COMPANYID, page, limit })) }} />
      <UpdateProductPriceModal companyid={COMPANYID} productid={selectedProductId} onRefresh={() => { dispatch(getProducts({ companyid: COMPANYID, page, limit })) }} />
      <UpdateProductVariantModal companyid={COMPANYID} productid={selectedProductId} onRefresh={() => { dispatch(getProducts({ companyid: COMPANYID, page, limit })) }} />
      <UpdateProductRequestFormModal companyid={COMPANYID} productid={selectedProductId} onRefresh={() => { dispatch(getProducts({ companyid: COMPANYID, page, limit })) }} />

    </main>
  );
}

