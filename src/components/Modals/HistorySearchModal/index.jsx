import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, Row, Col, } from 'react-bootstrap'

export default function HistorySearchModal({ isModalOpen, setIsModalOpen }) {
    const [active, setActive] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <Modal
            size="lg"
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
            centered
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title>Geçmişte Arama</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row className="align-items-center">
                        <Col lg="10" >
                            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                                Yeniden Adlandır
                            </Form.Label>
                            <Form.Control
                                className="mb-2"
                                id="inlineFormInput"
                                placeholder="Jane Doe"
                                value={"Adım 1"}
                            />
                        </Col>
                        <Col lg="2">
                            <Button type="submit" className="mb-2">
                                Gönder
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Modal.Dialog>DENEME</Modal.Dialog>
                <Modal.Footer>Eksi konuşma başlığını yeniden adlandırabilirsin</Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}
