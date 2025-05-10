import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';
import { useModal } from '../../components/Modals/ModalProvider'
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import MapPicker from "../../components/MapPicker";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import Breadcrumb from "../../components/Breadcrumb";

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
  const locationTypeOptions = [
    { label: "Tek Nokta (Point)", value: "point" },
    { label: "Alan (Circle)", value: "circle" },
    { label: "Yol (Path)", value: "path" }
  ];

  // ✅ Doğru kullanım
  useEffect(() => {
    // sadece ilk render’da çalışsın
    // veya belirli sabit bir bağımlılıkta
    //fetchInitialData();
  }, []); // boş dependency array → sadece ilk render

  const addField = () => {
    const alreadyHasMap = fields.some(f => f.type === "location");
    if (alreadyHasMap) {
      toast.warning("Sadece bir adet 'Lokasyon' alanı ekleyebilirsiniz.");
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
      dependencies: [],
      locationType: "point",
      bufferRadius: 5,
      points: []
    }]);
  };

  const updateField = (id, key, value) => {
    setFields(prevFields =>
      prevFields.map(field => {
        if (field.id === id) {
          let updatedField = { ...field, [key]: value };

          // Eğer file tipi seçilmiş ve multiple işaretlenmiş ama maxFiles boşsa → otomatik 5 ata
          if (updatedField.type === "file" && updatedField.multiple && !updatedField.maxFiles) {
            updatedField.maxFiles = 5;
          }

          return updatedField;
        }
        return field;
      })
    );
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
      fields: fields.map(field => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder,
        options: field.options || [],
        validation: field.validation || {},
        dependencies: field.dependencies || [],
        accept: field.accept,
        multiple: field.multiple,
        maxFiles: field.maxFiles,
        locationType: field.locationType,
      }))
    };

    console.log("Form JSON:", payload);
    //dispatch(saveForm(payload)); // ✅ Dispatch backend kaydı
  };


  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setFields(reordered);
  };


  const handleBack = () => {
    // ✅ Örnek kontrol: form değiştiyse uyar

    if (fields.length =!0) {
      const confirmLeave = window.confirm("Değişiklikler kaydedilmedi. Sayfadan çıkmak istiyor musunuz?");
      if (!confirmLeave) return;
    }

    // 🔙 Bir önceki sayfaya dön
    //navigate(-1); // veya navigate("/dashboard/forms")
  };

  return (
    <div className="form-section">
      <div className="form-content">
        <div className="form-container">
          <div className="container-fluid">
            <div class="container mt-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <button onClick={handleBack} className="btn btn-outline-light">
                  ⬅ Geri
                </button>

                <Breadcrumb
                  items={[
                    { label: "Ana Sayfa", path: "/dashboard" },
                    { label: "Formlar", path: "/dashboard/forms" },
                    { label: "Yeni Form Oluşturun" },
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
                  <div className="text-end mb-3">
                    <Button type="submit" variant="success">Formu Kaydet</Button>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="formFields">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {fields.map((field, index) => {
                            const isDepUnsupported = ["file", "location", "textarea"].includes(field.type);

                            return (<Draggable key={field.id} draggableId={field.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="border rounded p-3 mb-4 bg-light"
                                >
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
                                      {fields.filter(f => f.label === field.label).length > 1 && (
                                        <Form.Text className="text-danger">Bu etiket başka bir alanda da kullanılıyor. Lütfen benzersiz bir etiket girin.</Form.Text>
                                      )}
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

                                  {field.type === "file" && (
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>İzin Verilen Dosya Türleri</Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={field.accept || ""}
                                          onChange={(e) => updateField(field.id, "accept", e.target.value)}
                                          placeholder="örn: .pdf, .jpg, .png"
                                        />
                                      </Col>
                                      <Col>
                                        <Form.Label>Çoklu Yükleme</Form.Label>
                                        <Form.Check
                                          type="checkbox"
                                          label="Aktif"
                                          checked={field.multiple || false}
                                          onChange={(e) => updateField(field.id, "multiple", e.target.checked)}
                                        />
                                      </Col>
                                      {field.multiple && (
                                        <Col>
                                          <Form.Label>Maksimum Dosya Sayısı</Form.Label>
                                          <Form.Control
                                            type="number"
                                            value={field.maxFiles || ""}
                                            min={2}
                                            max={10}
                                            onChange={(e) => updateField(field.id, "maxFiles", Number(e.target.value))}
                                            placeholder="min:2 max:10"
                                          />
                                          <Form.Text className="text-white">
                                            Maksimum dosya sayısı belirtilmediği için 5 olarak ayarlanmıştır.
                                          </Form.Text>
                                        </Col>
                                      )}
                                    </Row>
                                  )}
                                  <Form.Group className="mb-2">
                                    <Form.Label>Placeholder</Form.Label>
                                    <Form.Control
                                      value={field.placeholder || ""}
                                      onChange={(e) => updateField(field.id, "placeholder", e.target.value)}
                                      placeholder="Kullanıcıya örnek metin"
                                    />
                                  </Form.Group>

                                  {["dropdown", "radio", "checkbox"].includes(field.type) && (
                                    <div className="mb-2">
                                      <Form.Label>Seçenekler</Form.Label>
                                      {(field.options || []).map((opt, idx) => (
                                        <Row key={idx} className="mb-1 align-items-center">
                                          <Col>
                                            <Form.Control
                                              type="text"
                                              placeholder="Etiket"
                                              value={opt.label}
                                              onChange={(e) => updateOption(field.id, idx, "label", e.target.value)}
                                            />
                                          </Col>
                                          <Col>
                                            <Form.Control
                                              type="text"
                                              placeholder="Değer"
                                              value={opt.value}
                                              onChange={(e) => updateOption(field.id, idx, "value", e.target.value)}
                                            />
                                          </Col>
                                          <Col xs="auto">
                                            <Button variant="danger" size="sm" onClick={() => {
                                              const updated = [...(field.options || [])];
                                              updated.splice(idx, 1);
                                              updateField(field.id, "options", updated);
                                            }}>Sil</Button>
                                          </Col>
                                        </Row>
                                      ))}
                                      <Button variant="outline-secondary" size="sm" onClick={() => addOptionToField(field.id)}>
                                        + Seçenek Ekle
                                      </Button>
                                    </div>

                                  )}
                                  {(field.type === "dropdown" || field.type === "radio" || field.type === "checkbox") && (
                                    <>
                                      <Form.Text className={!(field.options?.length > 0) ? "text-danger" : "text-muted"}>
                                        {(field.options || []).length === 0
                                          ? "Bu alanda seçenek yok. En az bir seçenek eklenmelidir."
                                          : "Kullanıcıdan seçim istenecektir."}
                                      </Form.Text>
                                    </>
                                  )}
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
                                  {field.type === "location" && (
                                    <>
                                      <Row className="mb-2">
                                        <Col>
                                          <Form.Label>Konum Seçim Tipi</Form.Label>
                                          <Form.Select
                                            value={field.locationType || "point"}
                                            onChange={(e) => updateField(field.id, "locationType", e.target.value)}
                                          >
                                            {locationTypeOptions.map(opt => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </Form.Select>
                                        </Col>
                                        {(field.locationType === "circle") && (
                                          <Col>
                                            <Form.Label>Etki Alanı (km)</Form.Label>
                                            <Form.Control
                                              type="number"
                                              min={1}
                                              max={100}
                                              value={field.bufferRadius || 5}
                                              onChange={(e) => updateField(field.id, "bufferRadius", parseInt(e.target.value))}
                                              placeholder="örnek: 5 km"
                                            />
                                          </Col>
                                        )}
                                      </Row>
                                      <Form.Text className="text-muted">Bu alan sadece bir kez eklenebilir. Harita önizlemesi yerine kullanıcı seçimine göre işlem yapılacaktır.</Form.Text>
                                    </>
                                  )}
                                  {isDepUnsupported ?
                                    <Form.Text className="text-warning">
                                      Bu alan tipi başka bir alana bağlı olarak gösterilemez.
                                    </Form.Text>
                                    :
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>Bağlı Olduğu Alan</Form.Label>
                                        <Form.Select
                                          value={field.dependencies?.[0]?.fieldid || ""}
                                          onChange={(e) => updateField(field.id, "dependencies", [{
                                            fieldid: e.target.value,
                                            condition: {
                                              operator: "equals",
                                              value: ""
                                            }
                                          }])}
                                        >
                                          <option value="">Bir alan seçin</option>
                                          {fields
                                            .filter(f => f.id !== field.id && ["text", "number", "date", "dropdown", "radio", "checkbox"].includes(f.type))
                                            .map(f => (
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
                                          {(() => {
                                            const depField = fields.find(f => f.id === field.dependencies?.[0]?.fieldid);
                                            const type = depField?.type;

                                            const operatorOptions = {
                                              text: ["equals", "not_equals"],
                                              number: ["equals", "not_equals", "greater_than", "less_than"],
                                              date: ["equals", "before", "after"],
                                              dropdown: ["equals", "not_equals"],
                                              radio: ["equals", "not_equals"],
                                              checkbox: ["contains", "not_contains"]
                                            };

                                            const ops = operatorOptions[type] || ["equals", "not_equals"];
                                            return ops.map(op => (
                                              <option key={op} value={op}>{op}</option>
                                            ));
                                          })()}
                                        </Form.Select>
                                      </Col>

                                      <Col>
                                        <Form.Label>Değer</Form.Label>
                                        {(() => {
                                          const depField = fields.find(f => f.id === field.dependencies?.[0]?.fieldid);
                                          const type = depField?.type;

                                          const value = field.dependencies?.[0]?.condition?.value || "";
                                          const onChange = (val) => {
                                            const prev = field.dependencies?.[0] || {};
                                            updateField(field.id, "dependencies", [{
                                              ...prev,
                                              condition: {
                                                operator: prev.condition?.operator || "equals",
                                                value: val
                                              }
                                            }])
                                          };

                                          if (["dropdown", "radio", "checkbox"].includes(type)) {
                                            const options = depField?.options || [];
                                            return (
                                              <Form.Select
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                              >
                                                <option value="">Seçiniz</option>
                                                {options.map((opt, idx) => (
                                                  <option key={idx} value={opt.value}>{opt.label}</option>
                                                ))}
                                              </Form.Select>
                                            );
                                          } else if (type === "number") {
                                            return (
                                              <Form.Control
                                                type="number"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                              />
                                            );
                                          } else if (type === "date") {
                                            return (
                                              <Form.Control
                                                type="date"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                              />
                                            );
                                          } else {
                                            // text veya diğerleri
                                            return (
                                              <Form.Control
                                                type="text"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                                placeholder="Değer (örn: mermer)"
                                              />
                                            );
                                          }
                                        })()}
                                      </Col>
                                    </Row>
                                  }
                                  ...
                                </div>
                              )}
                            </Draggable>)


                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>


                  <Button variant="outline-primary" onClick={addField} className="mb-4">
                    + Alan Ekle
                  </Button>

                  <div className="text-end">
                    <Button type="submit" variant="success">Formu Kaydet</Button>
                  </div>
                </Form>
              </Col>
              <Col md={6} className="ps-md-4" style={{ minWidth: "50%" }}>
                <h4 className="mb-2">📄 Form Önizleme</h4>
                <p className="text-white mb-4">
                  Bu alan formunuzun kullanıcıya nasıl görüneceğini gösterir. Alanlar pasif durumdadır (düzenlenemez).
                </p>
                <Form>
                  {fields.map((field, index) => {
                    const isDepUnsupported = ["file", "location", "textarea"].includes(field.type);
                    // 📌 1. dependencies kontrolü
                    const dep = field.dependencies?.[0];
                    if (dep) {
                      const depField = fields.find(f => f.id === dep.fieldid);
                      const unsupportedTypes = ["file", "location", "textarea"];
                      if (!depField || unsupportedTypes.includes(depField.type)) return null;

                      const operator = dep.condition?.operator || "equals";
                      const value = dep.condition?.value;

                      const mockedInputValue = depField?.options?.[0]?.value || "";

                      let isVisible = true;
                      if (operator === "equals") isVisible = mockedInputValue === value;
                      if (operator === "not_equals") isVisible = mockedInputValue !== value;
                      if (operator === "greater_than") isVisible = parseFloat(mockedInputValue) > parseFloat(value);
                      if (operator === "less_than") isVisible = parseFloat(mockedInputValue) < parseFloat(value);
                      if (operator === "before") isVisible = new Date(mockedInputValue) < new Date(value);
                      if (operator === "after") isVisible = new Date(mockedInputValue) > new Date(value);
                      if (operator === "contains") isVisible = mockedInputValue.includes(value);
                      if (operator === "not_contains") isVisible = !mockedInputValue.includes(value);

                      if (!isVisible) return null;
                    }

                    // 📌 2. Normal alan render'ı
                    return (
                      <Form.Group className="mb-3" key={field.id}>
                        <Form.Label>
                          {field.label} {field.required && <span className="text-danger">*</span>}
                        </Form.Label>
                        {field.type === "text" && (
                          <>
                            <Form.Control type="text" placeholder={field.placeholder} disabled />
                            {field.validation?.maxLength && (
                              <Form.Text className="text-white">En fazla {field.validation.maxLength} karakter girilebilir.</Form.Text>
                            )}
                          </>
                        )}
                        {field.type === "textarea" && (
                          <>
                            <Form.Control as="textarea" rows={3} placeholder={field.placeholder} disabled />
                            {field.validation?.maxLength && (
                              <Form.Text className="text-white">En fazla {field.validation.maxLength} karakter girilebilir.</Form.Text>
                            )}
                          </>
                        )}
                        {field.type === "number" && (
                          <>
                            <Form.Control type="number" placeholder={field.placeholder} disabled />
                            {(field.validation?.min || field.validation?.max) && (
                              <Form.Text className="text-white">
                                {field.validation.min && <>Min: {field.validation.min} </>}
                                {field.validation.max && <>Max: {field.validation.max}</>}
                              </Form.Text>
                            )}
                          </>
                        )}
                        {field.type === "date" && (
                          <>
                            <Form.Control type="date" placeholder={field.placeholder} disabled />
                            {(field.validation?.min || field.validation?.max) && (
                              <Form.Text className="text-white">
                                {field.validation.min && <>Başlangıç: {field.validation.min} </>}
                                {field.validation.max && <>Bitiş: {field.validation.max}</>}
                              </Form.Text>
                            )}
                          </>
                        )}
                        {field.type === "file" && (
                          <>
                            <Row className="align-items-center mb-2">
                              <Col>
                                <Form.Control
                                  type="file"
                                  disabled
                                  multiple={field.multiple}
                                  accept={field.accept}
                                />
                              </Col>
                              <Col xs="auto">
                                <Button variant="secondary" size="sm" disabled>
                                  Dosyaları Gönder
                                </Button>
                              </Col>
                            </Row>
                            <Form.Text className="text-white">
                              {field.accept && `İzin verilen dosya türleri: ${field.accept}. `}
                              {field.multiple && `En fazla ${field.maxFiles || "?"} dosya.`}
                            </Form.Text>
                          </>
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
                        {field.type === "location" && (
                          <Alert variant="info">
                            Bu form alanı kullanıcıya harita üzerinden lokasyon seçtirir. Harita yalnızca form sırasında görünür.
                          </Alert>
                        )}
                      </Form.Group>
                    );
                  })}
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
