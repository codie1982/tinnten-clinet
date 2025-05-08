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
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import ImageGalleryUploader from "../../components/ImageGalleryUploader";
import MapPicker from "../../components/MapPicker";
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
export default function FormBuilder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const [t, i18n] = useTranslation("global")
  const { user, isLogin } = useAuth();

  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [locationPreview, setLocationPreview] = useState({ lat: 39.9208, lng: 32.8541, radius: 5 });

  const fieldTypes = [
    "text", "textarea", "number", "date", "dropdown", "checkbox", "radio", "file", "location"
  ];

  const addField = () => {
    const locationFieldExists = fields.some(f => f.type === 'location');
    if (locationFieldExists) {
      toast.warning("Sadece bir konum alanı eklenebilir.");
      return;
    }

    setFields([...fields, {
      id: uuidv4(),
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      options: [],
      validation: {},
      dependencies: []
    }]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const addOptionToField = (id) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        return {
          ...field,
          options: [...(field.options || []), { label: "", value: "" }]
        };
      }
      return field;
    }));
  };

  const updateOption = (fieldId, index, key, value) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...field.options];
        newOptions[index][key] = value;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      formName,
      description,
      fields
    };
    console.log("Form Marker Payload:", payload);
    // dispatch(createDynamicForm(payload));
  };

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
                    <h2 className="form-title">Yeni Bir form oluştur</h2>
                    <p className="form-description">Sunduğunuz hizmeti tanımlayın, özelliklerini belirtin ve Tinnten'de yer alın.</p>
                  </div>
                  <Row>
                    <Col md={6} className="pe-md-4 border-end" style={{ minWidth: "50%" }}>
                      <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                          <Form.Label>Form Adı</Form.Label>
                          <Form.Control
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Form adı girin"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Form Açıklaması</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Bu formda kullanıcıdan hangi bilgiler istenecek?"
                          />
                        </Form.Group>

                        {fields.map((field, index) => (
                          <div key={field.id} className="border rounded p-3 mb-4 bg-light">
                            <Row className="mb-2">
                              <Col><strong>Alan #{index + 1}</strong></Col>
                              <Col className="text-end">
                                <Button variant="danger" size="sm" onClick={() => removeField(field.id)}>Kaldır</Button>
                              </Col>
                            </Row>

                            <Row className="mb-2">
                              <Col>
                                <Form.Label>Etiket</Form.Label>
                                <Form.Control
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, "label", e.target.value)}
                                  placeholder="Alan başlığı (örn: İsim, Zemin Türü)"
                                  required
                                />
                              </Col>
                              <Col>
                                <Form.Label>Tip</Form.Label>
                                <Form.Select
                                  value={field.type}
                                  onChange={(e) => updateField(field.id, "type", e.target.value)}>
                                  {fieldTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <Col xs={2} className="d-flex align-items-end">
                                <Form.Check
                                  type="checkbox"
                                  label="Zorunlu"
                                  checked={field.required}
                                  onChange={(e) => updateField(field.id, "required", e.target.checked)}
                                />
                              </Col>
                            </Row>

                            <Form.Group className="mb-2">
                              <Form.Label>Placeholder</Form.Label>
                              <Form.Control
                                value={field.placeholder || ""}
                                onChange={(e) => updateField(field.id, "placeholder", e.target.value)}
                                placeholder="Kullanıcıya örnek metin"
                              />
                            </Form.Group>

                            {(field.type === "text" || field.type === "textarea") && (
                              <Row className="mb-2">
                                <Col>
                                  <Form.Label>Max Karakter</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={field.validation?.maxLength || ""}
                                    onChange={(e) => updateField(field.id, "validation", { ...field.validation, maxLength: Number(e.target.value) })}
                                    placeholder="örn: 250"
                                  />
                                </Col>
                              </Row>
                            )}

                            {(field.type === "number" || field.type === "date") && (
                              <Row className="mb-2">
                                <Col>
                                  <Form.Label>Min Değer</Form.Label>
                                  <Form.Control
                                    type={field.type}
                                    value={field.validation?.min || ""}
                                    onChange={(e) => updateField(field.id, "validation", { ...field.validation, min: e.target.value })}
                                    placeholder="Minimum"
                                  />
                                </Col>
                                <Col>
                                  <Form.Label>Max Değer</Form.Label>
                                  <Form.Control
                                    type={field.type}
                                    value={field.validation?.max || ""}
                                    onChange={(e) => updateField(field.id, "validation", { ...field.validation, max: e.target.value })}
                                    placeholder="Maksimum"
                                  />
                                </Col>
                              </Row>
                            )}

                            <Row className="mb-2">

                              <Col>
                                <Form.Label>Bağlı Olduğu Alan</Form.Label>
                                <Form.Select
                                  value={field.dependencies?.[0]?.fieldid || ""}
                                  onChange={(e) => updateField(field.id, "dependencies", [{
                                    fieldid: e.target.value,
                                    condition: {
                                      operator: field.dependencies?.[0]?.condition?.operator || "equals",
                                      value: field.dependencies?.[0]?.condition?.value || ""
                                    }
                                  }])}
                                >
                                  <option value="">Bir alan seçin</option>
                                  {fields.filter(f => f.id !== field.id).map(f => (
                                    <option key={f.id} value={f.id}>{f.label || "(Adsız Alan)"}</option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <Col>
                                <Form.Label>Şart</Form.Label>
                                <Form.Select
                                  value={field.dependencies?.[0]?.condition?.operator || "equals"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const prev = field.dependencies?.[0] || {};
                                    updateField(field.id, "dependencies", [{
                                      ...prev,
                                      condition: {
                                        operator: val,
                                        value: prev.condition?.value || ""
                                      }
                                    }])
                                  }}
                                >
                                  <option value="equals">equals</option>
                                  <option value="not_equals">not equals</option>
                                </Form.Select>
                              </Col>
                              <Col>
                                <Form.Label>Değer</Form.Label>
                                <Form.Control
                                  value={field.dependencies?.[0]?.condition?.value || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const prev = field.dependencies?.[0] || {};
                                    updateField(field.id, "dependencies", [{
                                      ...prev,
                                      condition: {
                                        operator: prev.condition?.operator || "equals",
                                        value: val
                                      }
                                    }])
                                  }}
                                  placeholder="Değer (örn: mermer)"
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}

                        <Button variant="outline-primary" onClick={addField} className="mb-4">
                          + Alan Ekle
                        </Button>

                        <div className="text-end">
                          <Button type="submit" variant="success">Formu Kaydet</Button>
                        </div>
                      </Form>
                    </Col>
                    <Col md={6} className="ps-md-4" style={{ minWidth: "50%" }}>
                      <h4 className="mb-3">📄 Form Önizleme</h4>
                      <Form>
                        {fields.map((field, index) => (
                          <Form.Group className="mb-3" key={field.id}>
                            <Form.Label>
                              {field.label} {field.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            {field.type === "text" && (
                              <Form.Control type="text" placeholder={field.placeholder} disabled />
                            )}
                            {field.type === "textarea" && (
                              <Form.Control as="textarea" rows={3} placeholder={field.placeholder} disabled />
                            )}
                            {field.type === "number" && (
                              <Form.Control type="number" placeholder={field.placeholder} disabled />
                            )}
                            {field.type === "date" && (
                              <Form.Control type="date" placeholder={field.placeholder} disabled />
                            )}
                            {field.type === "file" && (
                              <Form.Control type="file" disabled />
                            )}
                            {field.type === "dropdown" && (
                              <Form.Select disabled>
                                <option>Seçiniz</option>
                                {(field.options || []).map((opt, i) => (
                                  <option key={i} value={opt.value}>{opt.label}</option>
                                ))}
                              </Form.Select>
                            )}
                            {field.type === "radio" && (
                              <div>
                                {(field.options || []).map((opt, i) => (
                                  <Form.Check
                                    key={i}
                                    type="radio"
                                    label={opt.label}
                                    value={opt.value}
                                    name={`radio-${field.id}`}
                                    disabled
                                  />
                                ))}
                              </div>
                            )}
                            {field.type === "checkbox" && (
                              <div>
                                {(field.options || []).map((opt, i) => (
                                  <Form.Check
                                    key={i}
                                    type="checkbox"
                                    label={opt.label}
                                    value={opt.value}
                                    name={`checkbox-${field.id}`}
                                    disabled
                                  />
                                ))}
                              </div>
                            )}
                            // Form Preview tarafında yeni location tipi gösterimi
                            {field.type === "location" && (
                              <MapPicker
                                lat={locationPreview.lat}
                                lng={locationPreview.lng}
                                radius={locationPreview.radius}
                                onLocationChange={(loc) => setLocationPreview(loc)}
                              />
                            )}
                          </Form.Group>
                        ))}
                      </Form>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}


/**
 * ...
      <hr className="my-5" />
      <h4>📄 Form Önizleme</h4>
      <Form>
        {fields.map((field, index) => (
          <Form.Group className="mb-3" key={field.id}>
            <Form.Label>
              {field.label} {field.required && <span className="text-danger">*</span>}
            </Form.Label>

            {field.type === "text" && (
              <Form.Control type="text" placeholder={field.placeholder} disabled />
            )}
            {field.type === "textarea" && (
              <Form.Control as="textarea" rows={3} placeholder={field.placeholder} disabled />
            )}
            {field.type === "number" && (
              <Form.Control type="number" placeholder={field.placeholder} disabled />
            )}
            {field.type === "date" && (
              <Form.Control type="date" placeholder={field.placeholder} disabled />
            )}
            {field.type === "file" && (
              <Form.Control type="file" disabled />
            )}
            {field.type === "dropdown" && (
              <Form.Select disabled>
                <option>Seçiniz</option>
                {(field.options || []).map((opt, i) => (
                  <option key={i} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            )}
            {field.type === "radio" && (
              <div>
                {(field.options || []).map((opt, i) => (
                  <Form.Check
                    key={i}
                    type="radio"
                    label={opt.label}
                    value={opt.value}
                    name={`radio-${field.id}`}
                    disabled
                  />
                ))}
              </div>
            )}
            {field.type === "checkbox" && (
              <div>
                {(field.options || []).map((opt, i) => (
                  <Form.Check
                    key={i}
                    type="checkbox"
                    label={opt.label}
                    value={opt.value}
                    name={`checkbox-${field.id}`}
                    disabled
                  />
                ))}
              </div>
            )}

          </Form.Group>
        ))}
      </Form>
...

 */


