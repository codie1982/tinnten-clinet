import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Container, Button, Form, Row, Col, Carousel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';

import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { useModal } from '../../components/Modals/ModalProvider'
import ImageGalleryUploader from "../../components/ImageGalleryUploader";
import Breadcrumb from "../../components/Breadcrumb";
import ProductPreview from "../../components/ProductPreview";
import { addProduct } from "../../api/product/productSlicer"

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

  const [slug, setSlug] = useState("");

  const [attributes, setAttributes] = useState([{ name: "", value: "" }]);

  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState([]); // ImageGalleryUploader'dan gelen

  const [rentalType, setRentalType] = useState("continuous"); // veya "periodic"
  const [periodType, setPeriodType] = useState("daily"); // daily, weekly, monthly, customRange
  const [multiplierType, setMultiplierType] = useState("percentage");
  const [multiplierValue, setMultiplierValue] = useState(0);
  const [pricingModifiers, setPricingModifiers] = useState([
    { label: "", type: "increase", value: 0 }
  ]);
  const [rentalCurrency, setRentalCurrency] = useState("TL");
  const [rentalBasePrice, setRentalBasePrice] = useState(0)
  const [variants, setVariants] = useState([
    {
      sku: "",
      stock: 0,
      price: { originalPrice: 0, discountRate: 0, currency: "TL" },
      attributes: [{ name: "", value: "" }],
    }
  ]);

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
      companyid: "6824aace3bd66ed798e41bbb",
      type: "product",
      title,
      meta,
      description,
      categories,
      redirectUrl,
      attributes,
      gallery: {
        title: galleryTitle,
        description: galleryDescription,
        images: galleryImages.map(({ uploadid, path }) => ({
          uploadid,
          path,
          type: "internal"
        }))
      },
      variants,
      priceType,

      ...(priceType === "fixed" && {
        basePrice: {
          originalPrice: Number(originalPrice),
          discountRate: Number(discountRate),
          currency,
          isOfferable,
          requestRequired
        }
      }),

      ...(priceType === "offer" && {
        requestForm: "selectedRequestFormId",
        isOfferable: true,
        requestRequired: true
      }),

      ...(priceType === "rental" && {
        rentalOptions: {
          basePrice: Number(rentalBasePrice),
          currency: rentalCurrency, // ✅ yeni eklendi
          mode: rentalType, // "continuous" | "periodic"
          ...(rentalType === "periodic" && {
            periodType // "daily" | "weekly" | ...
          }),
          ...(multiplierType && {
            multiplier: {
              type: multiplierType,
              value: Number(multiplierValue)
            }
          }),
          pricingModifiers
        }
      })
    };
    console.log("Ürün Payload:", payload);
    dispatch(addProduct(payload));
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
    <Container fluid>
      <Row>
        <Col md={7}>
          <div className="form-section">
            <div className="form-content">
              <div className="form-container">
                <div className="container-fluid">
                  <div class="container mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <Link to={"/dashboard/products"} class="btn btn-outline-light" >
                        ⬅ Geri
                      </Link>

                      <Breadcrumb
                        items={[
                          { label: "Ana Sayfa", path: "/dashboard" },
                          { label: "Ürün Yönetimi", path: "/dashboard/products" },
                          { label: "Yeni ürün ekle" },
                        ]}
                      />
                    </div>
                  </div>
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
                          uploaderId="main-product"
                          companyid={"6824aace3bd66ed798e41bbb"}
                          onAllImagesUploaded={(id, images) => {
                            if (id === "main-product") {
                              setGalleryImages(images);
                            }
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
                          label="Teklif Alınabilir"
                          name="priceType"
                          value="offer"
                          checked={priceType === "offer"}
                          onChange={() => setPriceType("offer")}
                        />
                        <Form.Check
                          type="radio"
                          label="Kiralana Bilir"
                          name="priceType"
                          value="rental"
                          checked={priceType === "rental"}
                          onChange={() => setPriceType("rental")}
                        />
                      </Col>
                    </Form.Group>

                    {priceType === "fixed" && (
                      <>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={2}>Satış Fiyatı</Form.Label>
                          <Col sm={7}>
                            <Form.Control
                              type="text"
                              value={originalPrice}
                              onChange={(e) => setOriginalPrice(e.target.value)}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^\d.]/g, "");
                              }}
                              placeholder="Ürünün fiyatı"
                            />
                          </Col>
                          <Col sm={3}>
                            <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                              <option value="TL">TL</option>
                              <option value="DL">DL</option>
                            </Form.Select>
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
                        <Form.Group className="mb-3">
                          <Form.Label>Varyantlar</Form.Label>
                          <Form.Text className="text-muted d-block mb-3">
                            Varyantlar, ürününüzün farklı seçeneklerini temsil eder (örneğin renk, boyut, depolama). Her varyant için ayrı stok ve fiyat belirleyebilirsiniz.
                          </Form.Text>

                          {variants.map((variant, vIdx) => (
                            <div key={vIdx} className="border p-3 mb-4 rounded  position-relative variant-bg">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  const updatedVariants = variants.filter((_, idx) => idx !== vIdx);
                                  setVariants(updatedVariants);
                                }}
                                className="position-absolute top-0 end-0 m-2"
                              >
                                Varyantı Sil
                              </Button>

                              {/* 📸 Varyanta Özel Görseller */}
                              {/* 📈 Varyant Fiyatı */}
                              <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>Varyant Fiyatı</Form.Label>
                                <Col sm={7}>
                                  <Form.Control
                                    type="text"
                                    value={variant.price?.originalPrice || ""}
                                    onChange={(e) => {
                                      const updated = [...variants];
                                      updated[vIdx].price.originalPrice = e.target.value.replace(/[^\d.]/g, "");
                                      setVariants(updated);
                                    }}
                                    placeholder="Varyant fiyatı"
                                  />
                                </Col>
                                <Col sm={3}>
                                  <Form.Select
                                    value={variant.price?.currency || "TL"}
                                    onChange={(e) => {
                                      const updated = [...variants];
                                      updated[vIdx].price.currency = e.target.value;
                                      setVariants(updated);
                                    }}
                                  >
                                    <option value="TL">TL</option>
                                    <option value="DL">DL</option>
                                  </Form.Select>
                                </Col>
                              </Form.Group>
                              <Row className="mb-3">
                                <Col>
                                  <strong>Varyant Görselleri</strong>
                                  <ImageGalleryUploader
                                    key={vIdx}
                                    uploaderId={`variant-${vIdx}`}
                                    initialImages={variant.images || []}
                                    companyid={"6824aace3bd66ed798e41bbb"}
                                    onAllImagesUploaded={(id, images) => {
                                      if (id === `variant-${vIdx}`) {
                                        const updated = [...variants];
                                        updated[vIdx].images = images.map(img => ({
                                          uploadid: img.uploadid,
                                          type: "internal",
                                          path: img.url || img.path
                                        }));
                                        setVariants(updated);
                                      }
                                    }}
                                  />
                                </Col>
                              </Row>

                              {/* Özellikler */}
                              <Row>
                                <Col>
                                  <strong>Varyant Özellikleri</strong>
                                  {(variant.attributes || []).map((attr, aIdx) => (
                                    <Row key={aIdx} className="mt-2 align-items-center">
                                      <Col sm={5}>
                                        <Form.Control
                                          placeholder="Özellik adı (örn. Renk)"
                                          value={attr.name}
                                          onChange={(e) => {
                                            const updated = [...variants];
                                            updated[vIdx].attributes[aIdx].name = e.target.value;
                                            setVariants(updated);
                                          }}
                                        />
                                      </Col>
                                      <Col sm={5}>
                                        <Form.Control
                                          placeholder="Değer (örn. Kırmızı)"
                                          value={attr.value}
                                          onChange={(e) => {
                                            const updated = [...variants];
                                            updated[vIdx].attributes[aIdx].value = e.target.value;
                                            setVariants(updated);
                                          }}
                                        />
                                      </Col>
                                      <Col sm={2}>
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => {
                                            const updated = [...variants];
                                            updated[vIdx].attributes = updated[vIdx].attributes.filter((_, i) => i !== aIdx);
                                            setVariants(updated);
                                          }}
                                        >
                                          ❌
                                        </Button>
                                      </Col>
                                    </Row>
                                  ))}

                                  <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => {
                                      const updated = [...variants];
                                      updated[vIdx].attributes.push({ name: "", value: "" });
                                      setVariants(updated);
                                    }}
                                  >
                                    + Özellik Ekle
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </Form.Group>
                        <Button variant="outline-primary" onClick={() => {
                          setVariants([...variants, {
                            sku: "",
                            stock: 0,
                            price: { originalPrice: 0, discountRate: 0, currency: "TL" },
                            attributes: [{ name: "", value: "" }],
                          }]);
                        }}>
                          Yeni Varyant Ekle
                        </Button>
                      </>
                    )}
                    {priceType === "offer" && (
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>Teklif Formu</Form.Label>
                        <Col sm={10}>
                          <Form.Select disabled>
                            <option>Teklif formu listesi (backend entegresi sonra yapılacak)</option>
                          </Form.Select>
                        </Col>
                      </Form.Group>
                    )}
                    {priceType === "rental" && (
                      <>
                        {/* Kiralama Tipi ve Periyot Seçimi zaten var */}

                        {/* 1️⃣ Ana Kiralama Fiyatı */}
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={2}>Kiralama Tipi</Form.Label>
                          <Col sm={10} className="d-flex gap-3">
                            <Form.Check
                              type="radio"
                              label="Sürekli Kiralık"
                              name="rentalType"
                              value="continuous"
                              checked={rentalType === "continuous"}
                              onChange={() => setRentalType("continuous")}
                            />
                            <Form.Check
                              type="radio"
                              label="Günlük Kiralık"
                              name="rentalType"
                              value="daily"
                              checked={rentalType === "daily"}
                              onChange={() => setRentalType("daily")}
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={2}>Kiralama Fiyatı</Form.Label>
                          <Col sm={7}>
                            <Form.Control
                              type="text"
                              value={originalPrice}
                              onChange={(e) => setOriginalPrice(e.target.value)}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^\d.]/g, "");
                              }}
                              placeholder="Ürünün fiyatı"
                            />
                          </Col>
                          <Col sm={3}>
                            <Form.Select value={rentalCurrency} onChange={(e) => setRentalCurrency(e.target.value)}>
                              <option value="TL">₺ TL</option>
                              <option value="DL">$ Dolar</option>
                            </Form.Select>
                          </Col>
                        </Form.Group>

                        {/* 2️⃣ Çarpanlı Fiyat Kuralları */}
                        <Form.Group className="mb-3">
                          <Form.Label>Fiyat Seçenek Kuralları</Form.Label>

                          {pricingModifiers.map((rule, idx) => (
                            <Row className="mb-2" key={idx}>
                              <Col sm={4}>
                                <Form.Control
                                  placeholder="Etiket (örn. 2 kişi)"
                                  value={rule.label}
                                  onChange={(e) => {
                                    const updated = [...pricingModifiers];
                                    updated[idx].label = e.target.value;
                                    setPricingModifiers(updated);
                                  }}
                                />
                              </Col>
                              <Col sm={3}>
                                <Form.Select
                                  value={rule.type}
                                  onChange={(e) => {
                                    const updated = [...pricingModifiers];
                                    updated[idx].type = e.target.value;
                                    setPricingModifiers(updated);
                                  }}
                                >
                                  <option value="increase">Artış (+)</option>
                                  <option value="decrease">Azalış (-)</option>
                                </Form.Select>
                              </Col>
                              <Col sm={3}>
                                <Form.Control
                                  type="text"
                                  placeholder="% Değer"
                                  value={rule.value}
                                  onChange={(e) => {
                                    const updated = [...pricingModifiers];
                                    updated[idx].value = e.target.value.replace(/[^\d.]/g, "");
                                    setPricingModifiers(updated);
                                  }}
                                />
                              </Col>
                              <Col sm={2}>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    setPricingModifiers(pricingModifiers.filter((_, i) => i !== idx));
                                  }}
                                >
                                  ❌
                                </Button>
                              </Col>
                            </Row>
                          ))}

                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              setPricingModifiers([...pricingModifiers, { label: "", type: "increase", value: "" }])
                            }
                          >
                            + Yeni Seçenek
                          </Button>
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
        </Col>
        <Col md={5}>
          <ProductPreview
            title={title}
            galleryImages={galleryImages}
            originalPrice={Number(originalPrice)}
            discountRate={Number(discountRate)}
            priceType={priceType}
            description={description}
            attributes={attributes}
          />
        </Col>
      </Row>
    </Container>
  );
}


