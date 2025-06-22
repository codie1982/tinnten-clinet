import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Tabs, Tab, Form, Button, ListGroup, FormControl } from "react-bootstrap";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { findProducttitle, createProducts } from "../../api/product/productSlicer"
import FileGalleryUploader from "../../components/FileGalleryUploader";
const COMPANYID = "6824aace3bd66ed798e41bbb";
export default function FindProductCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [key, setKey] = useState('upload');
  const [type, setType] = useState('file');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [showTabs, setShowTabs] = useState(true);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [ownDescription, setOwnDescription] = useState("")
  const [scrawUrl, setScrawUrl] = useState("")
  const [descriptions, setDescriptions] = useState({}); // Object to store descriptions per title

  const { titles, productList, isLoading, isSuccess, isError, operation } = useSelector((state) => state.product);

  useEffect(() => {
    if (operation === 'findProductTitle' && !isLoading && isSuccess && !isError) {
      console.log('titles', titles);
      setShowTabs(false); // Hide tabs when titles are successfully loaded
    } else if (operation === 'createProducts' && !isLoading && isSuccess && !isError) {
      console.log("productList", productList)
    }
  }, [titles, isLoading, isSuccess, isError, operation, productList]);


  useEffect(() => {
    console.log('uploadFiles', uploadFiles);
  }, [uploadFiles]);

  const handleFileSubmit = (e) => {
    e.preventDefault();
    dispatch(findProducttitle({ companyid: COMPANYID, uploads: uploadFiles, type: key }));
  };
  const handleWebScrawSubmit = (e) => {
    e.preventDefault();
    dispatch(findProducttitle({ companyid: COMPANYID, uploads: [{ url: scrawUrl }], type: key }));
  }
  const handleDescriptionSubmit = (e) => {
    e.preventDefault();
    dispatch(findProducttitle({ companyid: COMPANYID, uploads: [{ description: ownDescription }], type: key }));
  }

  const handleDeleteFile = (id) => {
    // Implement file deletion logic here
  };

  const handleTitleSelect = (title) => {
    setSelectedTitles((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
    // Clear description for deselected title
    if (selectedTitles.includes(title)) {
      setDescriptions((prev) => {
        const newDescriptions = { ...prev };
        delete newDescriptions[title];
        return newDescriptions;
      });
    }
  };

  const handleDescriptionChange = (title, value) => {
    setDescriptions((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const handleCreateProducts = () => {
    const payloads = selectedTitles
      .map((title) => ({
        title,
        description: descriptions[title]?.trim() || '',
      }))
    console.log('Payloads:', payloads);
    // Add logic to handle payloads (e.g., dispatch to Redux or API call)
    dispatch(createProducts({ companyid: COMPANYID, info: payloads }));
    setDescriptions({}); // Clear all descriptions
    setSelectedTitles([]); // Clear all selections
  };

  return (
    <main
      className="dashboard-content"
      style={{
        flex: 1,
        padding: '30px',
        backgroundColor: 'var(--background-open1-color)',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      <Container className="py-3">
        {/* Header Section */}
        <div className="form-header text-center mb-4">
          <h2
            className="form-title fw-bold"
            style={{
              color: 'var(--text-color)',
              fontSize: '2rem',
              textShadow: '1px 1px 2px var(--background-open4-color)',
              marginBottom: '0.5rem',
            }}
          >
            Ürünler ve Hizmetler
          </h2>
          <p
            className="form-description"
            style={{
              color: 'var(--standart-text-light-color)',
              fontSize: '1rem',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            Ürünlerinizi ve hizmetlerinizi buradan yönetebilir, yeni eklemeler yapabilir ve mevcut olanları güncelleyebilirsiniz.
          </p>
        </div>

        {/* Action Button */}
        <Row className="mb-3">
          <Col className="text-end">
            <Button
              onClick={() => navigate('/dashboard/products/add')}
              style={{
                backgroundColor: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                padding: '0.6rem 1.2rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                borderRadius: '8px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--button-hover)';
                e.target.style.borderColor = 'var(--button-border-hover)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
                e.target.style.borderColor = 'var(--primary-color)';
              }}
            >
              Yeni Ürün/Hizmet Ekle
            </Button>
          </Col>
        </Row>

        {/* Titles List */}
        {isSuccess && titles?.length > 0 && (
          <Container className="mb-4 p-3 rounded-3" style={{ backgroundColor: 'var(--background-open2-color)', border: '1px solid var(--border-color)' }}>
            <h3
              className="mb-3 fw-semibold"
              style={{
                color: 'var(--text-color)',
                fontSize: '1.5rem',
              }}
            >
              Bulunan Ürünler/Hizmetler ({titles.length} Adet)
            </h3>
            <ListGroup>
              {titles.map((title, index) => (
                <div key={index}>
                  <ListGroup.Item
                    action
                    active={selectedTitles.includes(title)}
                    onClick={() => handleTitleSelect(title)}
                    style={{
                      backgroundColor: selectedTitles.includes(title) ? 'var(--primary-color)' : 'var(--background-open4-color)',
                      color: selectedTitles.includes(title) ? 'var(--secondary-color)' : 'var(--text-color)',
                      borderColor: 'var(--border-color)',
                      marginBottom: '0.5rem',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      if (!selectedTitles.includes(title)) {
                        e.target.style.backgroundColor = 'var(--button-hover)';
                        e.target.style.color = 'var(--secondary-color)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selectedTitles.includes(title)) {
                        e.target.style.backgroundColor = 'var(--background-open4-color)';
                        e.target.style.color = 'var(--text-color)';
                      }
                    }}
                  >
                    {title}
                  </ListGroup.Item>
                  {selectedTitles.includes(title) && (
                    <Form.Group controlId={`titleDescription-${index}`} className="mt-2 mb-3">
                      <Form.Label style={{ color: 'var(--text-color)', fontWeight: '500' }}>
                        {title} için Tanım Ekle
                      </Form.Label>
                      <FormControl
                        as="textarea"
                        rows={3}
                        placeholder={`${title} için bir tanım girin...`}
                        value={descriptions[title] || ''}
                        onChange={(e) => handleDescriptionChange(title, e.target.value)}
                        style={{
                          backgroundColor: 'var(--background-open4-color)',
                          color: 'var(--text-color)',
                          borderColor: 'var(--border-color)',
                          padding: '0.75rem',
                        }}
                      />
                    </Form.Group>
                  )}
                </div>
              ))}
            </ListGroup>
            {selectedTitles.length > 0 && (
              <Button
                onClick={handleCreateProducts}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  borderColor: 'var(--primary-color)',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  marginTop: '1rem',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--button-hover)';
                  e.target.style.borderColor = 'var(--button-border-hover)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-color)';
                  e.target.style.borderColor = 'var(--primary-color)';
                }}
              >
                Ürün/Hizmet Oluştur
              </Button>
            )}
            <Button
              onClick={() => setShowTabs(!showTabs)}
              style={{
                backgroundColor: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                marginTop: '1rem',
                marginLeft: '1rem',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--button-hover)';
                e.target.style.borderColor = 'var(--button-border-hover)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
                e.target.style.borderColor = 'var(--primary-color)';
              }}
            >
              {showTabs ? 'Kurulum Asistanını Gizle' : 'Kurulum Asistanını Göster'}
            </Button>
          </Container>
        )}

        {/* Tabs Section */}
        {showTabs && (
          <Container className="bg-dark p-4 rounded-3 shadow-lg" style={{ backgroundColor: 'var(--background-open1-color)' }}>
            <h3
              className="mb-3 fw-semibold"
              style={{
                color: 'var(--text-color)',
                fontSize: '1.5rem',
              }}
            >
              Kurulum Yardımcısı
            </h3>
            <Tabs
              id="company-setup-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
              fill
              style={{
                borderBottom: '2px solid var(--border-color)',
              }}
            >
              {/* File Upload Tab */}
              <Tab
                eventKey="upload"
                title={<span style={{ color: 'var(--text-color)', fontWeight: '500' }}>Dosya Yükle</span>}
              >
                <div
                  className="p-3 rounded-3"
                  style={{
                    backgroundColor: 'var(--background-open2-color)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Form onSubmit={handleFileSubmit}>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Label style={{ color: 'var(--text-color)', fontWeight: '500' }}>
                        Firmanızı tanıtan dosyaları yükleyin (PDF, Word vb.)
                      </Form.Label>
                      <FileGalleryUploader
                        uploaderId="file-uploader-1"
                        initialFiles={[]}
                        companyid={COMPANYID}
                        onAllFilesUploaded={(id, files) => {
                          console.log('Files uploaded:', files);
                          if (id === 'file-uploader-1') {
                            setUploadFiles(files);
                          }
                        }}
                        onDeleteFiles={(id) => handleDeleteFile(id)}
                        isEditable={true}
                        maxFiles={5}
                        acceptedFileTypes={{
                          'application/pdf': ['.pdf'],
                          'text/plain': ['.txt'],
                        }}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'var(--button-hover)';
                        e.target.style.borderColor = 'var(--button-border-hover)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'var(--primary-color)';
                        e.target.style.borderColor = 'var(--primary-color)';
                      }}
                    >
                      Yükle ve Devam Et
                    </Button>
                  </Form>
                </div>
              </Tab>

              {/* Website Tab */}
              <Tab
                eventKey="website"
                title={<span style={{ color: 'var(--text-color)', fontWeight: '500' }}>Web Sayfası</span>}
              >
                <div
                  className="p-3 rounded-3"
                  style={{
                    backgroundColor: 'var(--background-open2-color)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Form onSubmit={handleWebScrawSubmit}>
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Label
                        style={{
                          color: 'var(--text-color)',
                          fontWeight: '500',
                          marginRight: '1rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Web sitenizin adresi
                      </Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://ornekfirma.com"
                        onChange={(e) => setScrawUrl(e.target.value)}
                        value={scrawUrl}
                        style={{
                          backgroundColor: 'var(--background-open4-color)',
                          color: 'var(--text-color)',
                          borderColor: 'var(--border-color)',
                          padding: '0.75rem',
                          flex: 1,
                        }}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'var(--button-hover)';
                        e.target.style.borderColor = 'var(--button-border-hover)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'var(--primary-color)';
                        e.target.style.borderColor = 'var(--primary-color)';
                      }}
                    >
                      Tara ve Devam Et
                    </Button>
                  </Form>
                </div>
              </Tab>

              {/* Description Tab */}
              <Tab
                eventKey="prompt"
                title={<span style={{ color: 'var(--text-color)', fontWeight: '500' }}>Açıklama Yaz</span>}
              >
                <div
                  className="p-3 rounded-3"
                  style={{
                    backgroundColor: 'var(--background-open2-color)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Form onSubmit={handleDescriptionSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'var(--text-color)', fontWeight: '500' }}>
                        Firmanızı kısaca anlatın
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        onChange={(e) => setOwnDescription(e.target.value)}
                        value={ownDescription}
                        placeholder="Örneğin: Bahçe bakımı, peyzaj ve haftalık çim biçme hizmetleri sunuyorum."
                        style={{
                          backgroundColor: 'var(--background-open4-color)',
                          color: 'var(--text-color)',
                          borderColor: 'var(--border-color)',
                          padding: '0.75rem',
                        }}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'var(--button-hover)';
                        e.target.style.borderColor = 'var(--button-border-hover)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'var(--primary-color)';
                        e.target.style.borderColor = 'var(--primary-color)';
                      }}
                    >
                      Oluştur ve Devam Et
                    </Button>
                  </Form>
                </div>
              </Tab>
            </Tabs>
          </Container>
        )}
      </Container>
    </main>
  );
}