


import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap'

import { useAuth } from 'context/authContext';
import { useModal } from '../../components/Modals/ModalProvider'

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Breadcrumb from "../../components/Breadcrumb";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { addForm, updateForm, getFormDetail } from '../../api/form/dynamicFormSlicer'; // Assuming Redux slice

const EditFormBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const { t } = useTranslation('global');
  const { user, isLogin } = useAuth();
  const { formid } = useParams();

  // State management
  const [formName, setFormName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [locationPreview, setLocationPreview] = useState({ lat: 39.9208, lng: 32.8541, radius: 5 });

  // Redux state
  const { formDetail, isLoading, isSuccess, isError, operation } = useSelector((state) => state.dynamicform);

  // Fetch data from service on component mount
  useEffect(() => {
    if (isLogin && formid) {
      dispatch(getFormDetail({ formid }));
    }
  }, [isLogin, formid, dispatch]);

  // Set fetched data to state
  useEffect(() => {
    if (operation === 'getFormDetail' && !isLoading && isSuccess && !isError && formDetail) {
      toast.success(t('form.successMessage'));
      console.log('formDetail', formDetail);

      // Ensure each field has a unique uuid
      const updatedFields = formDetail.fields.map((field) => ({
        ...field,
        uuid: field.uuid || uuidv4(), // Assign new uuid if missing
      }));

      // Set fetched data to state
      setFormName(formDetail.formName || '');
      setDescription(formDetail.description || '');
      setFields(updatedFields || []);
      setLocationPreview(
        formDetail.locationPreview || { lat: 39.9208, lng: 32.8541, radius: 5 }
      );
    } else if (operation === 'getFormDetail' && isError) {
      toast.error(t('form.fetchError'));
    }
  }, [isLoading, isSuccess, isError, operation, formDetail, t]);

  // Toast notifications for form update
  useEffect(() => {
    if (operation === 'updateForm' && !isLoading && isSuccess && !isError) {
      toast.success(t('form.updateSuccessMessage'));
      navigate('/dashboard/forms');
    } else if (operation === 'updateForm' && isError) {
      toast.error(t('form.updateErrorMessage'));
    }
  }, [isLoading, isSuccess, isError, operation, navigate, t]);

  // Constants
  const fieldTypes = useMemo(
    () => ['text', 'textarea', 'number', 'date', 'dropdown', 'checkbox', 'radio', 'file', 'location'],
    []
  );

  const locationTypeOptions = useMemo(
    () => [
      { label: t('locationTypes.point'), value: 'point' },
      { label: t('locationTypes.circle'), value: 'circle' },
      { label: t('locationTypes.path'), value: 'path' },
    ],
    [t]
  );

  // Handlers
  const addField = useCallback(() => {
    const alreadyHasMap = fields.some((f) => f.type === 'location');
    if (alreadyHasMap) {
      toast.warning(t('form.locationLimitWarning'));
      return;
    }

    setFields((prev) => [
      ...prev,
      {
        uuid: uuidv4(),
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        options: [],
        validation: {},
        dependencies: [],
        locationType: 'point',
        bufferRadius: 5,
        points: [],
      },
    ]);
  }, [fields, t]);

  const updateField = useCallback((uuid, key, value) => {
    setFields((prevFields) =>
      prevFields.map((field) => {
        if (field.uuid !== uuid) return field;
        let updatedField = { ...field, [key]: value };

        // Reset incompatible properties when type changes
        if (key === 'type') {
          updatedField = {
            ...updatedField,
            options: ['dropdown', 'radio', 'checkbox'].includes(value) ? updatedField.options || [] : [],
            validation: ['text', 'textarea', 'number', 'date'].includes(value) ? updatedField.validation || {} : {},
            locationType: value === 'location' ? updatedField.locationType || 'point' : undefined,
            bufferRadius: value === 'location' ? updatedField.bufferRadius || 5 : undefined,
            points: value === 'location' ? updatedField.points || [] : undefined,
            accept: value === 'file' ? updatedField.accept || '' : undefined,
            multiple: value === 'file' ? updatedField.multiple || false : undefined,
            maxFiles: value === 'file' && updatedField.multiple ? updatedField.maxFiles || 5 : undefined,
          };
        }

        // Auto-set maxFiles for file type
        if (updatedField.type === 'file' && updatedField.multiple && !updatedField.maxFiles) {
          updatedField.maxFiles = 5;
        }

        return updatedField;
      })
    );
  }, []);

  const removeField = useCallback((uuid) => {
    setFields((prev) => prev.filter((f) => f.uuid !== uuid));
  }, []);

  const addOptionToField = useCallback((uuid) => {
    setFields((prev) =>
      prev.map((field) =>
        field.uuid === uuid
          ? { ...field, options: [...(field.options || []), { label: '', value: '' }] }
          : field
      )
    );
  }, []);

  const updateOption = useCallback((fieldId, index, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.uuid === fieldId
          ? {
              ...field,
              options: field.options?.map((opt, i) => (i === index ? { ...opt, [key]: value } : opt)),
            }
          : field
      )
    );
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!formName.trim()) {
        toast.error(t('form.nameRequired'));
        return;
      }

      if (fields.some((f) => !f.label.trim())) {
        toast.error(t('form.labelRequired'));
        return;
      }

      const payload = {
        companyid: '6824aace3bd66ed798e41bbb', // Should come from props or context
        formName,
        description,
        fields: fields.map((field) => {
          const transformedField = {
            uuid: field.uuid,
            label: field.label,
            type: field.type,
            required: field.required,
            placeholder: field.placeholder,
            options: field.options || [],
            validation: field.validation || {},
            dependencies: (field.dependencies || []).map((dep) => ({
              ...dep,
              fieldid: dep.fieldid || field.uuid, // Ensure fieldid matches uuid
            })),
            locationType: field.locationType || 'point',
            _id: field._id || null,
          };

          if (field.type === 'file') {
            transformedField.accept = field.accept;
            transformedField.multiple = field.multiple;
            if (field.multiple && field.maxFiles) {
              transformedField.maxFiles = field.maxFiles;
            }
          }

          return transformedField;
        }),
      };

      console.log('payload', payload);
      dispatch(updateForm({ companyid: '6824aace3bd66ed798e41bbb', formid, payload }));
    },
    [formName, description, fields, dispatch, formid, t]
  );

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    setFields((prev) => {
      const reordered = [...prev];
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      return reordered;
    });
  }, []);

  const handleBack = useCallback(() => {
    if (fields.length > 0 || formName || description) {
      openModal({
        title: t('form.confirmLeaveTitle'),
        content: t('form.confirmLeaveMessage'),
        onConfirm: () => navigate('/dashboard/forms'),
        onCancel: closeModal,
      });
    } else {
      navigate('/dashboard/forms');
    }
  }, [fields.length, formName, description, navigate, openModal, closeModal, t]);

  // Form field validation
  const hasDuplicateLabels = useMemo(() => {
    const labels = fields.map((f) => f.label.toLowerCase().trim());
    return new Set(labels).size !== labels.length;
  }, [fields]);

  return (
    <div className="form-section">
      <div className="form-content">
        <div className="container-fluid">
          <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="outline-light" onClick={handleBack}>
                {t('form.back')}
              </Button>
              <Breadcrumb
                items={[
                  { label: t('breadcrumbs.home'), path: '/dashboard' },
                  { label: t('breadcrumbs.forms'), path: '/dashboard/forms' },
                  { label: t('breadcrumbs.editForm') },
                ]}
              />
            </div>
          </div>

          <div className="form-header">
            <h2 className="form-title">{t('form.editTitle')}</h2>
            <p className="form-description">{t('form.editDescription')}</p>
          </div>

          <Row>
            <Col md={6} className="pe-md-4 border-end">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('form.name')}</Form.Label>
                  <Form.Control
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={t('form.namePlaceholder')}
                    required
                    isInvalid={!formName.trim()}
                  />
                  <Form.Control.Feedback type="invalid">
                    {t('form.nameRequired')}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{t('form.descriptionLabel')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                  />
                </Form.Group>

                <div className="text-end mb-3">
                  <Button type="submit" disabled={isLoading || hasDuplicateLabels} variant="success">
                    {isLoading ? t('form.saving') : t('form.save')}
                  </Button>
                </div>

                {hasDuplicateLabels && (
                  <Alert variant="warning">{t('form.duplicateLabelsWarning')}</Alert>
                )}

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="formFields">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {fields.map((field, index) => {
                          const isDepUnsupported = ['file', 'location', 'textarea'].includes(field.type);

                          return (
                            <Draggable key={field.uuid} draggableId={field.uuid} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="border rounded p-3 mb-4 bg-light"
                                >
                                  <Row className="mb-2">
                                    <Col>
                                      <strong>{t('form.field')} #{index + 1}</strong>
                                    </Col>
                                    <Col className="text-end">
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeField(field.uuid)}
                                      >
                                        {t('form.remove')}
                                      </Button>
                                    </Col>
                                  </Row>

                                  <Row className="mb-2">
                                    <Col>
                                      <Form.Label>{t('form.label')}</Form.Label>
                                      <Form.Control
                                        value={field.label}
                                        onChange={(e) => updateField(field.uuid, 'label', e.target.value)}
                                        placeholder={t('form.labelPlaceholder')}
                                        required
                                        isInvalid={
                                          !field.label.trim() ||
                                          fields.filter((f) => f.label === field.label).length > 1
                                        }
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {fields.filter((f) => f.label === field.label).length > 1
                                          ? t('form.duplicateLabelError')
                                          : t('form.labelRequired')}
                                      </Form.Control.Feedback>
                                    </Col>
                                    <Col>
                                      <Form.Label>{t('form.type')}</Form.Label>
                                      <Form.Select
                                        value={field.type}
                                        onChange={(e) => updateField(field.uuid, 'type', e.target.value)}
                                      >
                                        {fieldTypes.map((type) => (
                                          <option key={type} value={type}>
                                            {t(`form.fieldTypes.${type}`)}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Col>
                                    <Col xs={2} className="d-flex align-items-end">
                                      <Form.Check
                                        type="checkbox"
                                        label={t('form.required')}
                                        checked={field.required}
                                        onChange={(e) =>
                                          updateField(field.uuid, 'required', e.target.checked)
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  {field.type === 'file' && (
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>{t('form.allowedFileTypes')}</Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={field.accept || ''}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'accept', e.target.value)
                                          }
                                          placeholder={t('form.allowedFileTypesPlaceholder')}
                                        />
                                      </Col>
                                      <Col>
                                        <Form.Label>{t('form.multipleUpload')}</Form.Label>
                                        <Form.Check
                                          type="checkbox"
                                          label={t('form.active')}
                                          checked={field.multiple || false}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'multiple', e.target.checked)
                                          }
                                        />
                                      </Col>
                                      {field.multiple && (
                                        <Col>
                                          <Form.Label>{t('form.maxFiles')}</Form.Label>
                                          <Form.Control
                                            type="number"
                                            value={field.maxFiles || ''}
                                            min={2}
                                            max={10}
                                            onChange={(e) =>
                                              updateField(field.uuid, 'maxFiles', Number(e.target.value))
                                            }
                                            placeholder={t('form.maxFilesPlaceholder')}
                                          />
                                          <Form.Text>
                                            {t('form.maxFilesDefault')}
                                          </Form.Text>
                                        </Col>
                                      )}
                                    </Row>
                                  )}

                                  <Form.Group className="mb-2">
                                    <Form.Label>{t('form.placeholder')}</Form.Label>
                                    <Form.Control
                                      value={field.placeholder || ''}
                                      onChange={(e) =>
                                        updateField(field.uuid, 'placeholder', e.target.value)
                                      }
                                      placeholder={t('form.placeholderExample')}
                                    />
                                  </Form.Group>

                                  {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
                                    <div className="mb-2">
                                      <Form.Label>{t('form.options')}</Form.Label>
                                      {(field.options || []).map((opt, idx) => (
                                        <Row key={idx} className="mb-1 align-items-center">
                                          <Col>
                                            <Form.Control
                                              type="text"
                                              placeholder={t('form.optionLabel')}
                                              value={opt.label}
                                              onChange={(e) =>
                                                updateOption(field.uuid, idx, 'label', e.target.value)
                                              }
                                            />
                                          </Col>
                                          <Col>
                                            <Form.Control
                                              type="text"
                                              placeholder={t('form.optionValue')}
                                              value={opt.value}
                                              onChange={(e) =>
                                                updateOption(field.uuid, idx, 'value', e.target.value)
                                              }
                                            />
                                          </Col>
                                          <Col xs="auto">
                                            <Button
                                              variant="danger"
                                              size="sm"
                                              onClick={() => {
                                                const updated = [...(field.options || [])];
                                                updated.splice(idx, 1);
                                                updateField(field.uuid, 'options', updated);
                                              }}
                                            >
                                              {t('form.delete')}
                                            </Button>
                                          </Col>
                                        </Row>
                                      ))}
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => addOptionToField(field.uuid)}
                                      >
                                        {t('form.addOption')}
                                      </Button>
                                      {!(field.options?.length > 0) && (
                                        <Form.Text className="text-danger">
                                          {t('form.optionsRequired')}
                                        </Form.Text>
                                      )}
                                    </div>
                                  )}

                                  {['text', 'textarea'].includes(field.type) && (
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>{t('form.maxLength')}</Form.Label>
                                        <Form.Control
                                          type="number"
                                          value={field.validation?.maxLength || ''}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'validation', {
                                              ...field.validation,
                                              maxLength: Number(e.target.value),
                                            })
                                          }
                                          placeholder={t('form.maxLengthPlaceholder')}
                                        />
                                      </Col>
                                    </Row>
                                  )}

                                  {['number', 'date'].includes(field.type) && (
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>{t('form.minValue')}</Form.Label>
                                        <Form.Control
                                          type={field.type}
                                          value={field.validation?.min || ''}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'validation', {
                                              ...field.validation,
                                              min: e.target.value,
                                            })
                                          }
                                          placeholder={t('form.minValuePlaceholder')}
                                        />
                                      </Col>
                                      <Col>
                                        <Form.Label>{t('form.maxValue')}</Form.Label>
                                        <Form.Control
                                          type={field.type}
                                          value={field.validation?.max || ''}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'validation', {
                                              ...field.validation,
                                              max: e.target.value,
                                            })
                                          }
                                          placeholder={t('form.maxValuePlaceholder')}
                                        />
                                      </Col>
                                    </Row>
                                  )}

                                  {field.type === 'location' && (
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>{t('form.locationType')}</Form.Label>
                                        <Form.Select
                                          value={field.locationType || 'point'}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'locationType', e.target.value)
                                          }
                                        >
                                          {locationTypeOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Col>
                                      {field.locationType === 'circle' && (
                                        <Col>
                                          <Form.Label>{t('form.bufferRadius')}</Form.Label>
                                          <Form.Control
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={field.bufferRadius || 5}
                                            onChange={(e) =>
                                              updateField(
                                                field.uuid,
                                                'bufferRadius',
                                                parseInt(e.target.value)
                                              )
                                            }
                                            placeholder={t('form.bufferRadiusPlaceholder')}
                                          />
                                        </Col>
                                      )}
                                      <Form.Text className="text-muted">
                                        {t('form.locationNote')}
                                      </Form.Text>
                                    </Row>
                                  )}

                                  {!isDepUnsupported && (
                                    <Row className="mb-2">
                                      <Col>
                                        <Form.Label>{t('form.dependentField')}</Form.Label>
                                        <Form.Select
                                          value={field.dependencies?.[0]?.fieldid || ''}
                                          onChange={(e) =>
                                            updateField(field.uuid, 'dependencies', [
                                              {
                                                fieldid: e.target.value,
                                                condition: {
                                                  operator: 'equals',
                                                  value: '',
                                                },
                                              },
                                            ])
                                          }
                                        >
                                          <option value="">{t('form.selectField')}</option>
                                          {fields
                                            .filter(
                                              (f) =>
                                                f.uuid !== field.uuid &&
                                                ['text', 'number', 'date', 'dropdown', 'radio', 'checkbox'].includes(
                                                  f.type
                                                )
                                            )
                                            .map((f) => (
                                              <option key={f.uuid} value={f.uuid}>
                                                {f.label || t('form.unnamedField')}
                                              </option>
                                            ))}
                                        </Form.Select>
                                      </Col>
                                      <Col>
                                        <Form.Label>{t('form.condition')}</Form.Label>
                                        <Form.Select
                                          value={field.dependencies?.[0]?.condition?.operator || 'equals'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const prev = field.dependencies?.[0] || {};
                                            updateField(field.uuid, 'dependencies', [
                                              {
                                                ...prev,
                                                condition: {
                                                  operator: val,
                                                  value: prev.condition?.value || '',
                                                },
                                              },
                                            ]);
                                          }}
                                        >
                                          {(() => {
                                            const depField = fields.find(
                                              (f) => f.uuid === field.dependencies?.[0]?.fieldid
                                            );
                                            const type = depField?.type;

                                            const operatorOptions = {
                                              text: ['equals', 'not_equals'],
                                              number: ['equals', 'not_equals', 'greater_than', 'less_than'],
                                              date: ['equals', 'before', 'after'],
                                              dropdown: ['equals', 'not_equals'],
                                              radio: ['equals', 'not_equals'],
                                              checkbox: ['contains', 'not_contains'],
                                            };

                                            const ops = operatorOptions[type] || ['equals', 'not_equals'];
                                            return ops.map((op) => (
                                              <option key={op} value={op}>
                                                {t(`form.operators.${op}`)}
                                              </option>
                                            ));
                                          })()}
                                        </Form.Select>
                                      </Col>
                                      <Col>
                                        <Form.Label>{t('form.value')}</Form.Label>
                                        {(() => {
                                          const depField = fields.find(
                                            (f) => f.uuid === field.dependencies?.[0]?.fieldid
                                          );
                                          const type = depField?.type;
                                          const value = field.dependencies?.[0]?.condition?.value || '';
                                          const onChange = (val) => {
                                            const prev = field.dependencies?.[0] || {};
                                            updateField(field.uuid, 'dependencies', [
                                              {
                                                ...prev,
                                                condition: {
                                                  operator: prev.condition?.operator || 'equals',
                                                  value: val,
                                                },
                                              },
                                            ]);
                                          };

                                          if (['dropdown', 'radio', 'checkbox'].includes(type)) {
                                            const options = depField?.options || [];
                                            return (
                                              <Form.Select
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                              >
                                                <option value="">{t('form.selectOption')}</option>
                                                {options.map((opt, idx) => (
                                                  <option key={idx} value={opt.value}>
                                                    {opt.label}
                                                  </option>
                                                ))}
                                              </Form.Select>
                                            );
                                          } else if (type === 'number') {
                                            return (
                                              <Form.Control
                                                type="number"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                              />
                                            );
                                          } else if (type === 'date') {
                                            return (
                                              <Form.Control
                                                type="date"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                              />
                                            );
                                          } else {
                                            return (
                                              <Form.Control
                                                type="text"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                                placeholder={t('form.valuePlaceholder')}
                                              />
                                            );
                                          }
                                        })()}
                                      </Col>
                                    </Row>
                                  )}
                                  {isDepUnsupported && (
                                    <Form.Text className="text-warning">
                                      {t('form.dependencyNotSupported')}
                                    </Form.Text>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <Button variant="outline-primary" onClick={addField} className="mb-4">
                  {t('form.addField')}
                </Button>

                <div className="text-end">
                  <Button type="submit" disabled={isLoading || hasDuplicateLabels} variant="success">
                    {isLoading ? t('form.saving') : t('form.save')}
                  </Button>
                </div>
              </Form>
            </Col>

            <Col md={6} className="ps-md-4">
              <h4 className="mb-2">{t('form.preview')}</h4>
              <p className="text-white mb-4">{t('form.previewDescription')}</p>
              <Form>
                {fields.map((field) => {
                  const isDepUnsupported = ['file', 'location', 'textarea'].includes(field.type);
                  const dep = field.dependencies?.[0];

                  if (dep) {
                    const depField = fields.find((f) => f.uuid === dep.fieldid);
                    if (!depField || isDepUnsupported) return null;

                    const operator = dep.condition?.operator || 'equals';
                    const value = dep.condition?.value;
                    const mockedInputValue = depField?.options?.[0]?.value || '';

                    let isVisible = true;
                    if (operator === 'equals') isVisible = mockedInputValue === value;
                    if (operator === 'not_equals') isVisible = mockedInputValue !== value;
                    if (operator === 'greater_than') isVisible = parseFloat(mockedInputValue) > parseFloat(value);
                    if (operator === 'less_than') isVisible = parseFloat(mockedInputValue) < parseFloat(value);
                    if (operator === 'before') isVisible = new Date(mockedInputValue) < new Date(value);
                    if (operator === 'after') isVisible = new Date(mockedInputValue) > new Date(value);
                    if (operator === 'contains') isVisible = mockedInputValue.includes(value);
                    if (operator === 'not_contains') isVisible = !mockedInputValue.includes(value);

                    if (!isVisible) return null;
                  }

                  return (
                    <Form.Group className="mb-3" key={field.uuid}>
                      <Form.Label>
                        {field.label} {field.required && <span className="text-danger">*</span>}
                      </Form.Label>
                      {field.type === 'text' && (
                        <>
                          <Form.Control type="text" placeholder={field.placeholder} disabled />
                          {field.validation?.maxLength && (
                            <Form.Text className="text-white">
                              {t('form.maxLengthText', { max: field.validation.maxLength })}
                            </Form.Text>
                          )}
                        </>
                      )}
                      {field.type === 'textarea' && (
                        <>
                          <Form.Control as="textarea" rows={3} placeholder={field.placeholder} disabled />
                          {field.validation?.maxLength && (
                            <Form.Text className="text-white">
                              {t('form.maxLengthText', { max: field.validation.maxLength })}
                            </Form.Text>
                          )}
                        </>
                      )}
                      {field.type === 'number' && (
                        <>
                          <Form.Control type="number" placeholder={field.placeholder} disabled />
                          {(field.validation?.min || field.validation?.max) && (
                            <Form.Text className="text-white">
                              {field.validation.min && t('form.min', { min: field.validation.min })}
                              {field.validation.max && t('form.max', { max: field.validation.max })}
                            </Form.Text>
                          )}
                        </>
                      )}
                      {field.type === 'date' && (
                        <>
                          <Form.Control type="date" placeholder={field.placeholder} disabled />
                          {(field.validation?.min || field.validation?.max) && (
                            <Form.Text className="text-white">
                              {field.validation.min &&
                                t('form.startDate', { date: field.validation.min })}
                              {field.validation.max &&
                                t('form.endDate', { date: field.validation.max })}
                            </Form.Text>
                          )}
                        </>
                      )}
                      {field.type === 'file' && (
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
                                {t('form.uploadFiles')}
                              </Button>
                            </Col>
                          </Row>
                          <Form.Text className="text-white">
                            {field.accept && t('form.allowedFileTypesText', { types: field.accept })}
                            {field.multiple &&
                              t('form.maxFilesText', { max: field.maxFiles || '?' })}
                          </Form.Text>
                        </>
                      )}
                      {field.type === 'dropdown' && (
                        <Form.Select disabled>
                          <option>{t('form.select')}</option>
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                      {field.type === 'radio' && (
                        <div>
                          {(field.options || []).map((opt, i) => (
                            <Form.Check
                              key={i}
                              type="radio"
                              label={opt.label}
                              value={opt.value}
                              name={`radio-${field.uuid}`}
                              disabled
                            />
                          ))}
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div>
                          {(field.options || []).map((opt, i) => (
                            <Form.Check
                              key={i}
                              type="checkbox"
                              label={opt.label}
                              value={opt.value}
                              name={`checkbox-${field.uuid}`}
                              disabled
                            />
                          ))}
                        </div>
                      )}
                      {field.type === 'location' && (
                        <Alert variant="info">{t('form.locationPreview')}</Alert>
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
  );
};



export default EditFormBuilder;