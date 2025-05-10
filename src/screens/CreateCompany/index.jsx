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


import { updateProfile } from "../../api/profile/profileSlicer"
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import BuisnessPackageModal from "../../components/Modals/BuisnessPackageModal";
import LogoImageUploader from "../../components/LogoImageUploader";
export default function CreateCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  const [uploadid, setUploadid] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [isCompanySlugValid, setIsCompanySlugValid] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState("");

  const [description, setDescription] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [industryTags, setIndustryTags] = useState([]);
  const [foundedDate, setFoundedDate] = useState("");
  const [phones, setPhones] = useState([{ type: "mobile", number: "" }]);
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", country: "" });
  const [socials, setSocials] = useState([{ platform: "facebook", link: "" }]);

  const socialOptions = [
    { value: "facebook", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaFacebook className="me-1" /> Facebook</span> },
    {
      value: "instagram", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <FaInstagram className="me-1" /> Instagram</span>
    },
    { value: "linkedin", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaLinkedin className="me-1" /> LinkedIn</span> },
    { value: "twitter", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaTwitter className="me-1" /> Twitter</span> },
    { value: "youtube", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaYoutube className="me-1" /> YouTube</span> },
    { value: "tiktok", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaTiktok className="me-1" /> TikTok</span> },
  ];

  const today = new Date().toISOString().split("T")[0];

  const handleImageUploaded = (uploadedImageUrl) => {
    console.log("Yeni resim URL'si:", uploadedImageUrl);
    setUploadid(uploadedImageUrl.uploadid);
  };
  const handleIndustryKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const value = industryInput.trim().replace(",", "");
      if (value && !industryTags.includes(value)) {
        setIndustryTags([...industryTags, value]);
      }
      setIndustryInput("");
    }
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {};
    formData.forEach((value, key) => {
      if (value !== "") {
        try {
          payload[key] = JSON.parse(value);
        } catch {
          payload[key] = value;
        }
      }
    });
    payload.industry = industryTags;
    payload.phone = phones;
    console.log("Form gönderilen payload:", payload);
    // dispatch(createCompany(payload));
  };

  useEffect(() => {
    if (companySlug.length < 3) return;
    const timeout = setTimeout(() => {
      // dispatch(checkCompanySlug(companySlug));
    }, 500);
    return () => clearTimeout(timeout);
  }, [companySlug, dispatch]);

  const updatePhone = (index, field, value) => {
    const updated = [...phones];
    updated[index][field] = value;
    setPhones(updated);
  };

  const addPhone = () => {
    setPhones([...phones, { type: "mobile", number: "" }]);
  };

  const removePhone = (index) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated);
  };

  const updateAddressField = (field, value) => {
    setAddress({ ...address, [field]: value });
  };

  const updateSocial = (index, field, value) => {
    const updated = [...socials];
    updated[index][field] = value;
    setSocials(updated);
  };

  const addSocial = () => {
    setSocials([...socials, { platform: "facebook", link: "" }]);
  };

  const removeSocial = (index) => {
    const updated = socials.filter((_, i) => i !== index);
    setSocials(updated);
  };
  return (
    <>
      <div className="form-section">
        <div className="form-content">
          <div className="form-container">
            <div className="container-fluid">
              <div className="form-header">
                <h2 className="form-title">Firma Kaydı</h2>
                <p className="form-description">
                  Firmanı kaydederek Tinnten ekosistemine ilk adımı at. Ürün ve hizmet ekleme işlemleri için ön onay alacaksın.
                </p>
              </div>
              <Form onSubmit={handleSubmitForm}>
                <input type="hidden" name="logo" value={uploadid} />
                <input type="hidden" name="email" value={user.email} />
                <input type="hidden" name="certifications" value="[]" />
                <input type="hidden" name="packagename" value={selectedPackageName} />
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Logo</Form.Label>
                  <Col sm={10}>
                    <LogoImageUploader onImageUploaded={handleImageUploaded} />
                    <Form.Text className="text-white">Firmanızın logosunu yükleyiniz.</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formCompanyName" className="mb-3">
                  <Form.Label column sm={2}>Firma Adı <span className="text-danger">*</span></Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      name="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="Firmanızın görünen adı"
                    />
                    <Form.Text className="text-white">
                      Bu ad herkese açık şekilde gösterilecektir. Genel firma adıdır.
                    </Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formCompanySlug" className="mb-3">
                  <Form.Label column sm={2}>Firma Kimliği (URL)</Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <InputGroup.Text>@</InputGroup.Text>
                      <Form.Control
                        name="companySlug"
                        value={companySlug}
                        onChange={(e) => {
                          let input = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")    // sadece küçük harf, rakam, tire ve boşluk bırak
                            .replace(/\\s+/g, "-")            // boşlukları tire yap
                            .replace(/-+/g, "-")              // birden fazla tireyi teke indir
                            .replace(/^-+|-+$/g, "");         // baştaki/sondaki tireleri sil
                          setCompanySlug(input);
                        }}
                        placeholder="benzersizfirma"
                        required
                      />
                      {isCompanySlugValid !== null && (
                        <InputGroup.Text className="bg-transparent border-0">
                          {isCompanySlugValid ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                          )}
                        </InputGroup.Text>
                      )}
                    </InputGroup>
                    <Form.Text className={isCompanySlugValid === false ? "text-danger" : "text-white"}>
                      Bu alan benzersiz olmalıdır. Firma URL'niz şu şekilde olacaktır: /company@{companySlug || "firmaniz"}
                    </Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Seçili Paket</Form.Label>
                  <Col sm={6} className="d-flex align-items-center">
                    <span>{selectedPackage}</span>
                  </Col>
                  <Col sm={4} className="text-end">
                    <Button variant="outline-primary" onClick={() => openModal("buissnessPackages")}>Paketleri Gör</Button>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Sektör</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      value={industryInput}
                      onChange={(e) => setIndustryInput(e.target.value)}
                      onKeyDown={handleIndustryKeyDown}
                      placeholder="Her sektör için virgül kullanın (örn: yazılım, üretim)"
                    />
                    <div className="d-flex flex-wrap mt-2">
                      {industryTags.map((tag, index) => (
                        <span key={index} className="badge bg-secondary me-2">{tag}</span>
                      ))}
                    </div>
                    <Form.Text className="text-white">Birden fazla sektör girebilirsiniz, her biri virgül ile ayrılmalıdır.</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Açıklama</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      name="description"
                      as="textarea"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={500}
                    />
                    <Form.Text className="text-white">
                      {500 - description.length} karakter kaldı. En fazla 500 karakter.
                    </Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Web Sitesi</Form.Label>
                  <Col sm={10}>
                    <Form.Control name="website" type="url" pattern="https?://.+" />
                    <Form.Text className="text-white">Geçerli bir web adresi giriniz (https://...)</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Kuruluş Tarihi</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      name="foundedDate"
                      type="date"
                      max={today}
                      value={foundedDate}
                      onChange={(e) => setFoundedDate(e.target.value)}
                    />
                    <Form.Text className="text-white">Bu gün veya geçmiş bir tarih seçiniz.</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Firma Tipi</Form.Label>
                  <Col sm={10}>
                    <Form.Check type="radio" label="Bireysel" name="companyType" value="bireysel" />
                    <Form.Check type="radio" label="Kurumsal" name="companyType" value="kurumsal" />
                    <Form.Text className="text-white">Firmanız bireysel mi kurumsal mı belirtiniz.</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Vergi / TC No</Form.Label>
                  <Col sm={10}>
                    <Form.Control name="taxOrIdentityNumber" />
                    <Form.Text className="text-white">Vergi numarası ya da T.C. kimlik numarası giriniz.</Form.Text>
                  </Col>
                </Form.Group>

                <Row className="mb-3">
                  <Col sm={2}></Col>
                  <Col>
                    <Button variant="outline-primary" onClick={addPhone} className="mt-2">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />Telefon Ekle
                    </Button>
                  </Col>
                </Row>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Telefonlar</Form.Label>
                  <Col sm={10}>
                    {phones.map((phone, index) => (
                      <Row key={index} className="mb-2 align-items-center">
                        <Col sm={4}>
                          <Form.Select
                            value={phone.type}
                            onChange={(e) => updatePhone(index, "type", e.target.value)}>
                            <option value="mobile">Mobil</option>
                            <option value="home">Ev</option>
                            <option value="work">İş</option>
                          </Form.Select>
                        </Col>
                        <Col sm={6}>
                          <Form.Control
                            type="text"
                            placeholder="Telefon numarası"
                            value={phone.number}
                            onChange={(e) => updatePhone(index, "number", e.target.value)}
                          />
                        </Col>
                        <Col sm={2}>
                          <Button variant="danger" onClick={() => removePhone(index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Form.Text className="text-white">Birden fazla telefon ekleyebilirsiniz.</Form.Text>
                  </Col>
                </Form.Group>

                {/* Adres Alanı */}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Adres</Form.Label>
                  <Col sm={10}>
                    <Row className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Sokak adı"
                          value={address.street}
                          onChange={(e) => updateAddressField("street", e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Şehir"
                          value={address.city}
                          onChange={(e) => updateAddressField("city", e.target.value)}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Bölge / Eyalet"
                          value={address.state}
                          onChange={(e) => updateAddressField("state", e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Posta Kodu"
                          value={address.zip}
                          onChange={(e) => updateAddressField("zip", e.target.value)}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Ülke"
                          value={address.country}
                          onChange={(e) => updateAddressField("country", e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Form.Text className="text-white">Adres bilgilerinizi doğru ve eksiksiz giriniz.</Form.Text>
                  </Col>
                </Form.Group>

                <Row className="mb-3">
                  <Col sm={2}></Col>
                  <Col>
                    <Button variant="outline-primary" onClick={addSocial} className="mt-2">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />Sosyal Medya Ekle
                    </Button>
                  </Col>
                </Row>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Sosyal Medya</Form.Label>
                  <Col sm={10}>
                    {socials.map((social, index) => (
                      <Row key={index} className="mb-2 align-items-center">
                        <Col sm={4}>
                          <Select
                            classNamePrefix="react-select"
                            options={socialOptions}
                            isSearchable={false} // ✅ arama özelliğini kapatır
                            value={socialOptions.find(opt => opt.value === social.platform)}
                            onChange={(selected) => updateSocial(index, "platform", selected.value)}
                          />
                        </Col>
                        <Col sm={6}>
                          <Form.Control
                            type="url"
                            placeholder="Platform bağlantı linki"
                            value={social.link}
                            onChange={(e) => updateSocial(index, "link", e.target.value)}
                          />
                        </Col>
                        <Col sm={2}>
                          <Button variant="danger" onClick={() => removeSocial(index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Form.Text className="text-white">Firmanızın sosyal medya bağlantılarını ekleyin.</Form.Text>
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
        <BuisnessPackageModal onSelectedPackage={(_id, title, name) => {
          setSelectedPackageName(name)
          setSelectedPackage(title)
          closeModal("buissnessPackages")
        }} />
      </div>
    </>
  );
}