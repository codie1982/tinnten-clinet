import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
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
import MapPicker from "../../components/MapPicker";
import Breadcrumb from "../../components/Breadcrumb";


export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [duration, setDuration] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [currency, setCurrency] = useState("TL");
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLocationBased, setIsLocationBased] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");


  const [coordinates, setCoordinates] = useState({ lat: 39.9208, lng: 32.8541 }); // Ankara default
  const [radius, setRadius] = useState(10); // km

  const handleCategoryKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = categoryInput.trim().replace(",", "");
      if (val && !categories.includes(val)) {
        setCategories([...categories, val]);
        setCategoryInput("");
      }
    }
  };

  const handleFeatureKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = featureInput.trim().replace(",", "");
      if (val && !features.includes(val)) {
        setFeatures([...features, val]);
        setFeatureInput("");
      }
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      categories,
      features,
      duration,
      price: priceType === "fixed" ? {
        originalPrice: Number(originalPrice),
        discountRate: Number(discountRate),
        currency,
        isOfferable: false,
        requestRequired: false
      } : {
        isOfferable: true,
        requestRequired: true
      },
      gallery: galleryImages,
      isLocationBased,
      location: isLocationBased ? { province, district } : null
    };
    console.log("Hizmet Payload:", payload);
    // dispatch(addService(payload));
  };

  return (
    <>
      <div className="form-section">
        <div className="form-content">
          <div className="form-container">
            <div className="container-fluid">
              <div class="container mt-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <Link to={navigate("/dashboard")} class="btn btn-outline-light" >
                    ⬅ Geri
                  </Link>

                  <Breadcrumb
                    items={[
                      { label: "Ana Sayfa", path: "/dashboard" },
                      { label: "Ayarlar", path: "/dashboard/settings" },
                    ]}
                  />
                </div>
              </div>
              <div className="form-header">
                <h2 className="form-title">Hizmet Ekle</h2>
                <p className="form-description">Sunduğunuz hizmeti tanımlayın, özelliklerini belirtin ve Tinnten'de yer alın.</p>
              </div>
              <Form onSubmit={handleSubmitForm}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Hizmet Adı</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Hizmet adı girin"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Açıklama</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Hizmet hakkında açıklama"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Kategoriler</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyDown={handleCategoryKeyDown}
                      placeholder="Her kategori için virgül veya Enter kullanın"
                    />
                    <div className="d-flex flex-wrap mt-2">
                      {categories.map((tag, index) => (
                        <span key={index} className="badge bg-secondary me-2">{tag}</span>
                      ))}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Öne Çıkan Özellikler</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={handleFeatureKeyDown}
                      placeholder="Her özellik için virgül veya Enter kullanın"
                    />
                    <div className="d-flex flex-wrap mt-2">
                      {features.map((f, index) => (
                        <span key={index} className="badge bg-info me-2">{f}</span>
                      ))}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Süre</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="örn: 2 gün, 1 hafta"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Fiyat Türü</Form.Label>
                  <Col sm={10} className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Sabit Fiyat"
                      name="priceType"
                      value="fixed"
                      checked={priceType === "fixed"}
                      onChange={() => setPriceType("fixed")}
                    />
                    <Form.Check
                      type="radio"
                      label="Teklif Alınabilir"
                      name="priceType"
                      value="offer"
                      checked={priceType === "offer"}
                      onChange={() => setPriceType("offer")}
                    />
                  </Col>
                </Form.Group>

                {priceType === "fixed" && (
                  <>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Fiyat (TL)</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="number"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="Hizmet fiyatı"
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>İndirim (%)</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="number"
                          value={discountRate}
                          onChange={(e) => setDiscountRate(e.target.value)}
                          placeholder="Varsa, indirim yüzdesi"
                        />
                      </Col>
                    </Form.Group>
                  </>
                )}

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Lokasyon Bağlı mı?</Form.Label>
                  <Col sm={10}>
                    <Form.Check
                      type="checkbox"
                      label="Evet, belirli bir şehirde sunuluyor"
                      checked={isLocationBased}
                      onChange={(e) => setIsLocationBased(e.target.checked)}
                    />
                  </Col>
                </Form.Group>

                {isLocationBased && (
                  <>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Ülke</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          placeholder="Ülke"
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Şehir</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Şehir"
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Hizmet Alanı (km)</Form.Label>
                      <Col sm={10}>
                        <Form.Range
                          value={radius}
                          min={1}
                          max={100}
                          step={1}
                          onChange={(e) => setRadius(Number(e.target.value))}
                        />
                        <div className="text-white">{radius} km çapında hizmet veriliyor.</div>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Harita Üzerinden Seçin</Form.Label>
                      <Col sm={10}>
                        <MapPicker
                          lat={coordinates.lat}
                          lng={coordinates.lng}
                          radius={radius}
                          onLocationChange={({ lat, lng, radius }) => {
                            setCoordinates({ lat, lng });
                            setRadius(radius);
                          }}
                        />
                        <Form.Text className="text-white">
                          Haritadan nokta seçerek hizmet konumunuzu belirleyin.
                        </Form.Text>
                      </Col>
                    </Form.Group>
                  </>
                )}
                <Form.Group as={Row} className="mb-3">
                  <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit">Hizmeti Kaydet</Button>
                  </Col>
                </Form.Group>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




