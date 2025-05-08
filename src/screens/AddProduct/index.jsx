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
export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [description, setDescription] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [priceType, setPriceType] = useState("fixed"); // "fixed" or "offer"
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [currency, setCurrency] = useState("TL");
  const [isOfferable, setIsOfferable] = useState(false);
  const [requestRequired, setRequestRequired] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]); // Şimdilik placeholder

  const [slug, setSlug] = useState("");

  const [attributes, setAttributes] = useState([{ name: "", value: "" }]);
  
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const payload = {
      title,
      meta,
      description,
      categories,
      redirectUrl,
      attributes,
      basePrice: priceType === "fixed" ? {
        originalPrice: Number(originalPrice),
        discountRate: Number(discountRate),
        currency,
        isOfferable,
        requestRequired,
      } : {
        isOfferable: true,
        requestRequired: true
      },
    };
    console.log("Ürün Payload:", payload);
    // dispatch(addProduct(payload));
  };

  const updateAttribute = (index, field, val) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = val;
    setAttributes(newAttrs);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    const filtered = attributes.filter((_, i) => i !== index);
    setAttributes(filtered);
  };
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  }, [title]);
  return (
    <>
      <>
        {isLogin && <Sidebar openSidebar={true} />}
        <div className="content">
          {isLogin && <Header />}
          <div className="form-section">
            <div className="form-content">
              <div className="form-container">
                <div className="container-fluid">
                  <div className="form-header">
                    <h2 className="form-title">Ürün Ekleyin</h2>
                    <p className="form-description">
                      Ürünlerinizi ekleyerek Tinnten de kullanıcıların bulmasını sağlaya bilirsiniz. hemen bir  ürün ekleyin.
                    </p>
                  </div>
                  <Form onSubmit={handleSubmitForm}>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Görseller</Form.Label>
                      <Col sm={10}>
                        <ImageGalleryUploader
                          onAllImagesUploaded={(gallery) => {
                            console.log("Tüm yüklenenler:", gallery);
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Ürün Adı</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          placeholder="Ürün adı girin"
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Benzersiz Ürün Kodu</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          readOnly
                          value={slug}
                          placeholder="Otomatik oluşturulacak"
                        />
                        <Form.Text className="text-white">
                          Bu alan ürün adı temel alınarak oluşturulur ve sistemde benzersiz tanımlama sağlar.
                        </Form.Text>
                      </Col>
                    </Form.Group>
                    ...

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Meta Açıklama</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          value={meta}
                          onChange={(e) => setMeta(e.target.value)}
                          placeholder="Kısa açıklama - SEO amaçlı"
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
                          placeholder="Ürünün detaylı açıklaması"
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
                      <Form.Label column sm={2}>Yönlendirme Linki</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="url"
                          value={redirectUrl}
                          onChange={(e) => setRedirectUrl(e.target.value)}
                          placeholder="Kullanıcının yönlendirileceği URL"
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
                          label="Teklif İstenebilir"
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
                              placeholder="Ürünün fiyatı"
                            />
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={2}>İndirim Oranı (%)</Form.Label>
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

                    <Row className="mb-3">
                      <Col sm={2}>  </Col>
                      <Col sm={10} className="d-flex gap-3">
                        <Button variant="outline-primary" onClick={addAttribute} className="mt-2">
                          <FontAwesomeIcon icon={faPlus} className="me-2" /> Özellik Ekle
                        </Button>
                      </Col>
                    </Row>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={2}>Özellikler</Form.Label>
                      <Col sm={10}>
                        {attributes.map((attr, index) => (
                          <Row key={index} className="mb-2 align-items-center">
                            <Col sm={5}>
                              <Form.Control
                                placeholder="Özellik adı (örn. Renk)"
                                value={attr.name}
                                onChange={(e) => updateAttribute(index, "name", e.target.value)}
                              />
                            </Col>
                            <Col sm={5}>
                              <Form.Control
                                placeholder="Değer (örn. Kırmızı)"
                                value={attr.value}
                                onChange={(e) => updateAttribute(index, "value", e.target.value)}
                              />
                            </Col>
                            <Col sm={2}>
                              <Button variant="danger" onClick={() => removeAttribute(index)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </Col>
                          </Row>
                        ))}

                        <Form.Text className="text-white">Ürününüz için ek özellikler tanımlayabilirsiniz.</Form.Text>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Kaydet</Button>
                      </Col>
                    </Form.Group>

                  </Form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </>
    </>
  );
}


