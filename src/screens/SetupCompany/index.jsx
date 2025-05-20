import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, InputGroup, Spinner,ProgressBar } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import Select from "react-select";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import { useModal } from '../../components/Modals/ModalProvider'
import { createCompany, checkCompanySlug } from "../../api/company/companySlicer"

import BuisnessPackageModal from "../../components/Modals/BuisnessPackageModal";
import LogoImageUploader from "../../components/LogoImageUploader";
import { toast } from "react-toastify";
import MapPicker from "../../components/MapPicker";

export default function SetupCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { packagename, id } = useParams();
  const { openModal, closeModal } = useModal();
  const [t] = useTranslation("global");
  const { user, isLogin } = useAuth();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 41.015137, lng: 28.979530 }); // Example: Istanbul
  const [radius, setRadius] = useState(1);
  const [uploadid, setUploadid] = useState("");
  const [uploadImage, setUploadImage] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [isCompanySlugValid, setIsCompanySlugValid] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [industryTags, setIndustryTags] = useState([]);
  const [foundedDate, setFoundedDate] = useState("");
  const [phones, setPhones] = useState([{ type: "mobile", number: "" }]);
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", country: "" });
  const [socials, setSocials] = useState([{ platform: "facebook", link: "", username: "" }]);
  const [website, setWebsite] = useState("");

  const socialOptions = [
    { value: "facebook", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaFacebook className="me-1" /> Facebook</span> },
    { value: "instagram", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaInstagram className="me-1" /> Instagram</span> },
    { value: "linkedin", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaLinkedin className="me-1" /> LinkedIn</span> },
    { value: "twitter", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaTwitter className="me-1" /> Twitter</span> },
    { value: "youtube", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaYoutube className="me-1" /> YouTube</span> },
    { value: "tiktok", label: <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaTiktok className="me-1" /> TikTok</span> },
  ];

  const getFullSocialLink = (platform, username) => {
    const baseUrls = {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/in/",
      youtube: "https://youtube.com/@",
      tiktok: "https://tiktok.com/@",
    };
    return `${baseUrls[platform]}${username}`;
  };

  const parseSocialUrl = (url) => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace("www.", "");
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const platformMap = {
        "facebook.com": "facebook",
        "instagram.com": "instagram",
        "linkedin.com": "linkedin",
        "twitter.com": "twitter",
        "youtube.com": "youtube",
        "tiktok.com": "tiktok",
      };
      const platform = platformMap[hostname];
      const username = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "";
      return platform && username ? { platform, username } : null;
    } catch (e) {
      return null;
    }
  };

  const { isSlugLoading, isSlugSuccess, isSlugError } = useSelector((state) => state.company);
  const today = new Date().toISOString().split("T")[0];

  const handleImageUploaded = (image) => {
    setUploadImage(image);
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
    const payload = {
      companySlug,
      companyName,
      companyType,
      description,
      foundedDate,
      industry: industryTags,
      packagename: selectedPackageName,
      logo: uploadImage,
      email: user.email,
      phone: phones.filter(p => p.number.length >= 10),
      location: { lat: coordinates.lat, lng: coordinates.lng, radius },
      address: { street: address.street, city: address.city, state: address.state, zip: address.zip, country: address.country },
      social: socials
        .filter(s => s.username && s.platform)
        .map(s => ({
          platform: s.platform,
          username: s.username,
          link: s.link || getFullSocialLink(s.platform, s.username),
        })),
      website,
      certifications: [],
      taxOrIdentityNumber: "",
      packageid: selectedPackage,
    };

    dispatch(createCompany(payload)).then(() => {
      toast.success("Firma başarıyla kaydedildi!");
      navigate("/dashboard");
    });
  };

  useEffect(() => {
    if (companySlug.length < 3) return;
    const timeout = setTimeout(() => {
      dispatch(checkCompanySlug({ slug: companySlug }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [companySlug, dispatch]);

  useEffect(() => {
    if (!isSlugLoading) {
      if (isSlugSuccess) {
        setIsCompanySlugValid(true);
        toast.success(`${companySlug} ismini kullanabilirsiniz.`);
      }
      if (isSlugError) {
        setIsCompanySlugValid(false);
        toast.error("Bu isim kullanılamaz");
      }
    }
  }, [isSlugLoading, isSlugSuccess, isSlugError, companySlug]);

  const updatePhone = (index, field, value) => {
    const updated = [...phones];
    updated[index][field] = value;
    setPhones(updated);
  };

  const addPhone = () => {
    setPhones([...phones, { type: "mobile", number: "" }]);
  };

  const removePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const updateAddressField = (field, value) => {
    setAddress({ ...address, [field]: value });
  };

  const updateSocial = (index, field, value) => {
    setSocials(prevSocials =>
      prevSocials.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addSocial = () => {
    setSocials([...socials, { platform: "facebook", username: "", link: "" }]);
  };

  const removeSocial = (index) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setCompanySlug(
      companyName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  }, [companyName]);

  const clearIndustryTags = (tag) => {
    setIndustryTags(prev => prev.filter(tg => tg !== tag));
  };

  useEffect(() => {
    const packagename = searchParams.get("packagename");
    const id = searchParams.get("id");
    if (packagename) setSelectedPackageName(packagename);
    if (id) setSelectedPackage(id);
  }, [searchParams]);

  const nextStep = () => {
    if (currentStep === 1 && (!companyName || !companySlug || isCompanySlugValid === false)) {
      toast.error("Lütfen firma adı ve geçerli bir firma kimliği giriniz.");
      return;
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
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
                <Form.Text className="text-white">Bu ad herkese açık şekilde gösterilecektir.</Form.Text>
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
                    disabled={isSlugLoading}
                    className={`form-control ${isSlugLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onChange={(e) => {
                      const input = e.target.value
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      setCompanySlug(input);
                    }}
                    placeholder="benzersizfirma"
                    required
                  />
                  {isSlugLoading ? (
                    <InputGroup.Text className="bg-transparent">
                      <Spinner animation="border" role="status" />
                    </InputGroup.Text>
                  ) : (
                    isCompanySlugValid !== null && (
                      <InputGroup.Text className="bg-transparent border-0">
                        {isCompanySlugValid ? (
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                        ) : (
                          <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                        )}
                      </InputGroup.Text>
                    )
                  )}
                </InputGroup>
                <Form.Text className={isCompanySlugValid === false ? "text-danger" : "text-white"}>
                  Bu alan benzersiz olmalıdır. Firma URL'niz: /company@{companySlug || "firmaniz"}
                </Form.Text>
              </Col>
            </Form.Group>
          </>
        );
      case 2:
        return (
          <>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Seçili Paket</Form.Label>
              <Col sm={6} className="d-flex align-items-center">
                <span>{selectedPackageName || "Paket seçilmedi"}</span>
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
                    <span key={index} className="badge bg-secondary me-2" style={{ cursor: "pointer" }} onClick={() => clearIndustryTags(tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Form.Text className="text-white">Birden fazla sektör girebilirsiniz, virgül ile ayırın.</Form.Text>
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
                <Form.Text className="text-white">{500 - description.length} karakter kaldı.</Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Firma Tipi</Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="radio"
                  label="Bireysel"
                  name="companyType"
                  value="individual"
                  checked={companyType === "individual"}
                  onChange={(e) => setCompanyType(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Kurumsal"
                  name="companyType"
                  value="corporate"
                  checked={companyType === "corporate"}
                  onChange={(e) => setCompanyType(e.target.value)}
                />
                <Form.Text className="text-white">Firmanız bireysel mi kurumsal mı belirtiniz.</Form.Text>
              </Col>
            </Form.Group>
          </>
        );
      case 3:
        return (
          <>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Web Sitesi</Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="website"
                  type="url"
                  pattern="https?://.+"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <Form.Text className="text-white">Geçerli bir web adresi giriniz (https://...)</Form.Text>
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
                        onChange={(e) => updatePhone(index, "type", e.target.value)}
                      >
                        <option value="mobile">Mobil</option>
                        <option value="work">Sabit</option>
                      </Form.Select>
                    </Col>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        placeholder="Telefon numarası"
                        value={phone.number}
                        onChange={(e) => {
                          let input = e.target.value.replace(/\D/g, "");
                          if (input.length > 11) input = input.slice(0, 11);
                          if (input.length > 0 && !input.startsWith("0")) input = "0" + input;
                          updatePhone(index, "number", input);
                        }}
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
          </>
        );
      case 4:
        return (
          <>
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
                <Row>
                  <Col>
                    <Button variant="primary" onClick={() => setShowMap(!showMap)}>
                      {showMap ? "Haritayı Gizle" : "Haritadan Seç"}
                    </Button>
                  </Col>
                </Row>
                {showMap && (
                  <Row>
                    <Col>
                      <MapPicker
                        lat={coordinates.lat}
                        lng={coordinates.lng}
                        onLocationChange={({ lat, lng, radius }) => {
                          setCoordinates({ lat, lng });
                        }}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Form.Group>
          </>
        );
      case 5:
        return (
          <>
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
                {socials.map((social, index) => {
                  const platformOption = socialOptions.find(opt => opt.value === social.platform);
                  const generatedLink = getFullSocialLink(social.platform, social.username);
                  return (
                    <React.Fragment key={index}>
                      <Row className="mb-3 align-items-center">
                        <Col sm={3}>
                          <Select
                            classNamePrefix="react-select"
                            options={socialOptions}
                            isSearchable={false}
                            value={platformOption}
                            onChange={(selected) => updateSocial(index, "platform", selected.value)}
                          />
                        </Col>
                        <Col sm={5}>
                          <Form.Control
                            type="text"
                            placeholder="https://instagram.com/kullaniciadi veya sadece kullaniciadi"
                            value={social.link || social.username}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              if (!value.includes(" ") && !value.startsWith("http") && !value.includes("www.")) {
                                updateSocial(index, "username", value.replace(/^@/, ""));
                                updateSocial(index, "link", "");
                                return;
                              }
                              const normalizedValue = value.startsWith("http") ? value : "https://" + value;
                              const parsed = parseSocialUrl(normalizedValue);
                              if (parsed) {
                                updateSocial(index, "platform", parsed.platform);
                                updateSocial(index, "username", parsed.username);
                                updateSocial(index, "link", normalizedValue);
                              } else {
                                updateSocial(index, "link", "");
                              }
                            }}
                          />
                        </Col>
                        <Col sm={2}>
                          <Button variant="danger" onClick={() => removeSocial(index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col>
                          {social.username && (
                            <Form.Text className="text-white">
                              Link: <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a>
                            </Form.Text>
                          )}
                        </Col>
                      </Row>
                    </React.Fragment>
                  );
                })}
                <Form.Text className="text-white">Firmanızın sosyal medya bağlantılarını ekleyin.</Form.Text>
              </Col>
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };

  return (
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
            <ProgressBar now={(currentStep / 5) * 100} label={`Adım ${currentStep}/5`} className="mb-4" />
            <Form onSubmit={currentStep === 5 ? handleSubmitForm : (e) => e.preventDefault()}>
              <input type="hidden" name="logo" value={uploadid} />
              <input type="hidden" name="email" value={user.email} />
              <input type="hidden" name="certifications" value="[]" />
              <input type="hidden" name="taxOrIdentityNumber" value="" />
              <input type="hidden" name="packagename" value={selectedPackageName} />
              <input type="hidden" name="packageid" value={selectedPackage} />
              {renderStep()}
              <Row className="mb-3">
                <Col sm={{ span: 10, offset: 2 }} className="d-flex justify-content-between">
                  {currentStep > 1 && (
                    <Button variant="outline-secondary" onClick={prevStep}>
                      Geri
                    </Button>
                  )}
                  {currentStep < 5 ? (
                    <Button variant="primary" onClick={nextStep}>
                      İleri
                    </Button>
                  ) : (
                    <Button type="submit" variant="primary">
                      Kaydet
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <BuisnessPackageModal
          onSelectedPackage={(_id, title, name) => {
            setSelectedPackageName(name);
            setSelectedPackage(title);
            closeModal("buissnessPackages");
          }}
        />
      </div>
    </div>
  );
}