// 🔄 Modal versiyonu için hazırlanan güncellenmiş FormBuilder bileşeni
// Bu bileşen, var olan bir formu düzenlemek için modal içinde açılır.

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getFormDetail, updateForm,resetForm } from "../../../api/form/dynamicFormSlicer";
import { useModal } from "../../../components/Modals/ModalProvider";
import { toast } from "react-toastify";

export default function UpdateFormModal({ formid, companyid, onRefresh }) {
    const dispatch = useDispatch();
    const { closeModal, isOpen } = useModal();
  
    // Local state for form fields
    const [formName, setFormName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([]);
  
    // Available field types (same as FormBuilder)
    const fieldTypes = [
      'text',
      'textarea',
      'number',
      'date',
      'dropdown',
      'checkbox',
      'radio',
      'file',
      'location',
    ];
  
    // Access form slice state
    const { formDetail, isLoading, isSuccess, isError, message, operation } = useSelector(
      (state) => state.dynamicform
    );
  
    // Fetch form details when modal opens
    useEffect(() => {
      if (isOpen('updateFormModal') && formid) {
        dispatch(getFormDetail({ formid }));
      }
    }, [dispatch, isOpen, formid]);
  
    // Populate form fields when formDetail is available
    useEffect(() => {
      if (formDetail) {
        setFormName(formDetail.formName || '');
        setDescription(formDetail.description || '');
        setFields(
          formDetail.fields?.map((field) => ({
            ...field,
            id: field._id || uuidv4(), // Ensure each field has a unique ID for drag-and-drop
          })) || []
        );
      }
    }, [formDetail]);
  
    // Handle success and error notifications
    useEffect(() => {
      if (isSuccess && operation === 'updateForm') {
        toast.success('Form başarıyla güncellendi.');
        closeModal('updateFormModal');
        onRefresh();
      }
      if (isError && operation === 'updateForm') {
        toast.error(`Form güncelleme hatası: ${message}`);
      }
    }, [isSuccess, isError, message, operation, closeModal, onRefresh]);
  
    // Reset state on unmount
    useEffect(() => {
      return () => {
        dispatch(resetForm());
      };
    }, [dispatch]);
  
    // Add new field
    const addField = () => {
      const alreadyHasMap = fields.some((f) => f.type === 'location');
      if (alreadyHasMap) {
        toast.warning("Sadece bir adet 'Lokasyon' alanı ekleyebilirsiniz.");
        return;
      }
  
      const newField = {
        id: uuidv4(), // Unique ID for drag-and-drop
        label: '',
        type: 'text', // Default type
        required: false,
        validation: {},
        placeholder: '',
        options: [], // For dropdown, checkbox, radio
        locationType: 'point', // For location fields
        bufferRadius: 5, // For location circle
      };
      setFields([...fields, newField]);
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formName.trim()) {
        toast.error('Form adı zorunludur.');
        return;
      }
      const payload = {
        formName,
        description,
        fields: fields.map((field) => {
          const transformedField = {
            label: field.label,
            type: field.type,
            required: field.required,
            validation: field.validation || {},
            placeholder: field.placeholder || '',
            options: field.options || [],
            locationType: field.locationType || 'point',
          };
          if (field.type === 'location') {
            transformedField.bufferRadius = field.bufferRadius || 5;
          }
          return transformedField;
        }),
      };
      dispatch(updateForm({ companyid, formid, data: payload }));
    };
  
    // Update field property
    const updateField = (id, key, value) => {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === id ? { ...field, [key]: value } : field
        )
      );
    };
  
    // Remove field
    const removeField = (id) => {
      setFields(fields.filter((f) => f.id !== id));
    };
  
    // Handle drag-and-drop reordering
    const handleDragEnd = (result) => {
      if (!result.destination) return;
      const reorderedFields = Array.from(fields);
      const [removed] = reorderedFields.splice(result.source.index, 1);
      reorderedFields.splice(result.destination.index, 0, removed);
      setFields(reorderedFields);
    };
  
    return (
      <Modal
        size="lg"
        show={isOpen('updateFormModal')}
        onHide={() => closeModal('updateFormModal')}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Formu Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && operation === 'getFormDetail' ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
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
  
              <Form.Group className="mb-3">
                <Form.Label>Açıklama</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Form açıklaması"
                />
              </Form.Group>
  
              <Button variant="outline-primary" onClick={addField} className="mb-3">
                + Alan Ekle
              </Button>
  
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="formFields">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {fields.length > 0 ? (
                        fields.map((field, index) => (
                          <Draggable
                            key={field.id}
                            draggableId={field.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border p-3 rounded mb-3 bg-light"
                              >
                                <Row className="align-items-center">
                                  <Col>
                                    <Form.Label>Alan {index + 1} Etiketi</Form.Label>
                                    <Form.Control
                                      value={field.label || ''}
                                      onChange={(e) =>
                                        updateField(field.id, 'label', e.target.value)
                                      }
                                      placeholder="Alan etiketi girin"
                                    />
                                  </Col>
                                  <Col xs="auto">
                                    <Button
                                      variant="danger"
                                      onClick={() => removeField(field.id)}
                                    >
                                      Sil
                                    </Button>
                                  </Col>
                                </Row>
                                <Row className="mt-2">
                                  <Col>
                                    {field._id ? (
                                      // Existing fields: Type is read-only
                                      <div className="text-muted">
                                        Tip: <strong>{field.type}</strong>, Zorunlu:{' '}
                                        <strong>{field.required ? 'Evet' : 'Hayır'}</strong>
                                        {field.validation?.minLength
                                          ? `, Min Uzunluk: ${field.validation.minLength}`
                                          : ''}
                                      </div>
                                    ) : (
                                      // New fields: Allow type selection
                                      <Form.Group>
                                        <Form.Label>Tip</Form.Label>
                                        <Form.Select
                                          value={field.type}
                                          onChange={(e) =>
                                            updateField(field.id, 'type', e.target.value)
                                          }
                                        >
                                          {fieldTypes.map((type) => (
                                            <option key={type} value={type}>
                                              {type}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                    )}
                                  </Col>
                                  <Col xs="auto">
                                    <Form.Check
                                      type="checkbox"
                                      label="Zorunlu"
                                      checked={field.required || false}
                                      onChange={(e) =>
                                        updateField(field.id, 'required', e.target.checked)
                                      }
                                    />
                                  </Col>
                                </Row>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-muted">Formda alan bulunamadı.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
  
              <div className="text-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="success"
                >
                  {isLoading && operation === 'updateForm'
                    ? 'Güncelleniyor...'
                    : 'Güncelle'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    );
  }
