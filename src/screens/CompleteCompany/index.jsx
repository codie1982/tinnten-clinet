import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Container,Tabs,Tab,Form,Button } from "react-bootstrap";
import { useAuth } from "../../context/authContext";
import Header from "../../layouts/HeaderNoAuth";

import useAgentSocket from "../../hooks/useAgentSocket";
export default function CompleteCompany() {
  const [key, setKey] = useState("upload");

  return (
    <Container className="my-5">
      <h2 className="mb-4">Kurulum Yardımcısı</h2>
      <Tabs
        id="company-setup-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        fill
      >
        <Tab eventKey="upload" title="Dosya Yükle">
          <Form>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Firmanızı tanıtan dosyaları yükleyin (PDF, Word vb.)</Form.Label>
              <Form.Control type="file" multiple />
            </Form.Group>
            <Button variant="primary" type="submit">
              Yükle ve Devam Et
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="website" title="Web Sayfası">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Web sitenizin adresi</Form.Label>
              <Form.Control type="url" placeholder="https://ornekfirma.com" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Tara ve Devam Et
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="prompt" title="Açıklama Yaz">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Firmanızı kısaca anlatın</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Örneğin: Bahçe bakımı, peyzaj ve haftalık çim biçme hizmetleri sunuyorum."
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Oluştur ve Devam Et
            </Button>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
} 