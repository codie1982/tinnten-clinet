import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Col, Form, Row, Button, Alert, ProgressBar } from 'react-bootstrap';
import FileGalleryUploader from "../FileGalleryUploader";

const FormView = forwardRef(
  (
    {
      fields,
      t,
      isPreview,
      isSubmitInternal,
      isStepper,
      stepCount = 1,
      onSubmit,
      onSubmitSuccess,
      onFirstFieldRendered,
      onLastFieldRendered,
      onFieldCountChange,
      onStepChange,
      onFormDataChange,
      companyid,
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [visibleFields, setVisibleFields] = useState(
      fields.filter((field) => !field.dependencies || field.dependencies.length === 0)
    );

    // fields prop'u değiştiğinde visibleFields'ı güncelle
    useEffect(() => {
      setVisibleFields(
        fields.filter((field) => !field.dependencies || field.dependencies.length === 0)
      );
      // Mevcut formData ile bağımlılıkları kontrol et
      fields.forEach((field) => {
        if (formData[field._id]) {
          checkDependencies(field.uuid, formData[field._id]);
        }
      });
    }, [fields]);

    // Bağımlılıkları kontrol eden fonksiyon
    const checkDependencies = (changedUuid, newValue) => {
      const dependentFields = fields.filter((field) =>
        field.dependencies?.some((dep) => dep.fieldid === changedUuid)
      );

      setVisibleFields((prevVisibleFields) => {
        let newVisibleFields = [...prevVisibleFields];
        dependentFields.forEach((field) => {
          const dep = field.dependencies[0];
          const depField = fields.find((f) => f.uuid === dep.fieldid);
          if (!depField) return;

          const operator = dep.condition?.operator || 'equals';
          const value = dep.condition?.value;
          const mockedInputValue = newValue || formData[depField._id] || depField?.options?.[0]?.value || '';

          let isVisible = false;
          if (operator === 'equals') isVisible = mockedInputValue === value;
          if (operator === 'not_equals') isVisible = mockedInputValue !== value;
          if (operator === 'greater_than') isVisible = parseFloat(mockedInputValue) > parseFloat(value);
          if (operator === 'less_than') isVisible = parseFloat(mockedInputValue) < parseFloat(value);
          if (operator === 'before') isVisible = new Date(mockedInputValue) < new Date(value);
          if (operator === 'after') isVisible = new Date(mockedInputValue) > new Date(value);
          if (operator === 'contains') isVisible = mockedInputValue.includes(value);
          if (operator === 'not_contains') isVisible = !mockedInputValue.includes(value);

          if (isVisible && !newVisibleFields.some((f) => f.uuid === field.uuid)) {
            newVisibleFields.push(field);
          } else if (!isVisible) {
            newVisibleFields = newVisibleFields.filter((f) => f.uuid !== field.uuid);
          }
        });

        // Bağımlılığı olmayan alanları her zaman koru
        const nonDependentFields = fields.filter(
          (field) => !field.dependencies || field.dependencies.length === 0
        );
        nonDependentFields.forEach((field) => {
          if (!newVisibleFields.some((f) => f.uuid === field.uuid)) {
            newVisibleFields.push(field);
          }
        });

        return newVisibleFields;
      });
    };

    // Form verilerini güncelleme ve bağımlılık kontrolü
    const handleInputChange = (id, value) => {
      setFormData((prev) => {
        const newFormData = { ...prev, [id]: value };
        if (onFormDataChange) {
          onFormDataChange(newFormData);
        }
        return newFormData;
      });
      // id'den uuid'yi bul ve bağımlılıkları kontrol et
      const field = fields.find((f) => f._id === id);
      if (field) {
        checkDependencies(field.uuid, value);
      }
    };

    // Dosya silme işlemi
    const handleDeleteFile = (uploaderId) => {
      const id = uploaderId.replace('file-uploader-', '');
      setFormData((prev) => {
        const newFormData = { ...prev, [id]: [] };
        if (onFormDataChange) {
          onFormDataChange(newFormData);
        }
        return newFormData;
      });
      // id'den uuid'yi bul ve bağımlılıkları kontrol et
      const field = fields.find((f) => f._id === id);
      if (field) {
        checkDependencies(field.uuid, []);
      }
    };

    // Form submit işlemi
    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      if (onSubmit) {
        const result = onSubmit(formData);
        if (onSubmitSuccess && result) {
          onSubmitSuccess(formData);
        }
      }
    };

    // Dışarıdan submit için kullanılacak metod
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        handleSubmit();
      },
    }));

    // Adımlı görünüm için alanları bölme
    const getStepFields = () => {
      if (!isStepper) return visibleFields;
      const startIndex = currentStep * stepCount;
      return visibleFields.slice(startIndex, startIndex + stepCount);
    };

    // Adım kontrolleri
    const totalSteps = isStepper ? Math.ceil(visibleFields.length / stepCount) : 1;
    const canGoNext = isStepper && currentStep < totalSteps - 1 && visibleFields.length > stepCount;
    const canGoPrev = isStepper && currentStep > 0 && visibleFields.length > stepCount;
    const progress = isStepper ? ((currentStep + 1) / totalSteps) * 100 : 100;

    // Kabul edilen dosya türlerini MIME formatına çevir
    const getAcceptedFileTypes = (accept) => {
      if (!accept) return { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] };
      const types = accept.split(',').reduce((acc, ext) => {
        ext = ext.trim().toLowerCase();
        if (ext === '.pdf') {
          acc['application/pdf'] = acc['application/pdf'] || [];
          acc['application/pdf'].push('.pdf');
        } else if (ext === '.txt') {
          acc['text/plain'] = acc['text/plain'] || [];
          acc['text/plain'].push('.txt');
        }
        return acc;
      }, {});
      return types;
    };

    // Görünen alan sayısını bildir
    useEffect(() => {
      if (onFieldCountChange) {
        onFieldCountChange(visibleFields.length);
      }
    }, [visibleFields.length, onFieldCountChange]);

    // Adım değiştiğinde callback
    useEffect(() => {
      if (onStepChange && isStepper) {
        onStepChange(currentStep + 1, totalSteps);
      }
    }, [currentStep, totalSteps, onStepChange, isStepper]);

    return (
      <Col md={6} className="ps-md-4">
        {isPreview && (
          <>
            <h4 className="mb-2">{t('form.preview')}</h4>
            <p className="text-white mb-4">{t('form.previewDescription')}</p>
          </>
        )}
        {isStepper && (
          <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-3" />
        )}
        <Form onSubmit={handleSubmit}>
          {getStepFields().map((field, index) => {
            const isFirstField = index === 0;
            const isLastField = index === getStepFields().length - 1;

            // İlk ve son alan için callback'leri tetikle
            if (isFirstField && onFirstFieldRendered) {
              onFirstFieldRendered(field);
            }
            if (isLastField && onLastFieldRendered) {
              onLastFieldRendered(field);
            }

            return (
              <Form.Group className="mb-3" key={field._id}>
                <Form.Label>
                  {field.label} {field.required && <span className="text-danger">*</span>}
                </Form.Label>
                {field.type === 'text' && (
                  <>
                    <Form.Control
                      type="text"
                      placeholder={field.placeholder}
                      disabled={isPreview}
                      value={formData[field._id] || ''}
                      onChange={(e) => handleInputChange(field._id, e.target.value)}
                      required={field.required}
                    />
                    {field.validation?.maxLength && (
                      <Form.Text className="text-white">
                        {t('form.maxLengthText', { max: field.validation.maxLength })}
                      </Form.Text>
                    )}
                  </>
                )}
                {field.type === 'textarea' && (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={field.placeholder}
                      disabled={isPreview}
                      value={formData[field._id] || ''}
                      onChange={(e) => handleInputChange(field._id, e.target.value)}
                      required={field.required}
                    />
                    {field.validation?.maxLength && (
                      <Form.Text className="text-white">
                        {t('form.maxLengthText', { max: field.validation.maxLength })}
                      </Form.Text>
                    )}
                  </>
                )}
                {field.type === 'number' && (
                  <>
                    <Form.Control
                      type="number"
                      placeholder={field.placeholder}
                      disabled={isPreview}
                      value={formData[field._id] || ''}
                      onChange={(e) => handleInputChange(field._id, e.target.value)}
                      required={field.required}
                    />
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
                    <Form.Control
                      type="date"
                      placeholder={field.placeholder}
                      disabled={isPreview}
                      value={formData[field._id] || ''}
                      onChange={(e) => handleInputChange(field._id, e.target.value)}
                      required={field.required}
                    />
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
                  <FileGalleryUploader
                    uploaderId={`file-uploader-${field._id}`}
                    initialFiles={formData[field._id] || []}
                    companyid={companyid}
                    onAllFilesUploaded={(id, files) => {
                      const fieldId = id.replace('file-uploader-', '');
                      handleInputChange(fieldId, files);
                    }}
                    onDeleteFiles={(id) => handleDeleteFile(id)}
                    isEditable={!isPreview}
                    maxFiles={field.maxFiles || 5}
                    acceptedFileTypes={getAcceptedFileTypes(field.accept)}
                  />
                )}
                {field.type === 'dropdown' && (
                  <Form.Select
                    disabled={isPreview}
                    value={formData[field._id] || ''}
                    onChange={(e) => handleInputChange(field._id, e.target.value)}
                    required={field.required}
                  >
                    <option value="">{t('form.select')}</option>
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
                        name={`radio-${field._id}`}
                        disabled={isPreview}
                        checked={formData[field._id] === opt.value}
                        onChange={(e) => handleInputChange(field._id, e.target.value)}
                        required={field.required}
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
                        name={`checkbox-${field._id}`}
                        disabled={isPreview}
                        checked={formData[field._id]?.includes(opt.value) || false}
                        onChange={(e) => {
                          const currentValues = formData[field._id] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, opt.value]
                            : currentValues.filter((v) => v !== opt.value);
                          handleInputChange(field._id, newValues);
                        }}
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
          {isStepper && visibleFields.length > stepCount && (
            <Row className="mt-3">
              <Col>
                <Button
                  variant="secondary"
                  disabled={!canGoPrev}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="me-2"
                >
                  {t('form.previous')}
                </Button>
                <Button
                  variant="primary"
                  disabled={!canGoNext}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  {t('form.next')}
                </Button>
                <span className="text-white ms-3">
                  {t('form.step', { current: currentStep + 1, total: totalSteps })}
                </span>
              </Col>
            </Row>
          )}
          {isSubmitInternal && (
            <Row className="mt-3">
              <Col>
                <Button type="submit" variant="success">
                  {t('form.submit')}
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Col>
    );
  }
);

export default FormView;