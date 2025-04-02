import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, Row, Col, } from 'react-bootstrap'

export default function RenameHistoryModal({ isModalOpen, setIsModalOpen, title, handleRename }) {
    const [active, setActive] = useState(false);
    const [_title, setTitle] = useState(title)

  
    return (
        <Modal
            size="lg"
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
            centered
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title>Yeniden Adlandır</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleRename}>
                    <Row className="align-items-center">
                        <Col lg="10" >
                            <Form.Label htmlFor="inlineFormInput" >
                                Konuşma başlığını yeniden adlandır
                            </Form.Label>
                            <Form.Control
                                className="mb-2"
                                id="inlineFormInput"
                                placeholder="Konuşma içeriğini "
                                name='title'
                                onChange={(e) => setTitle(e.target.value)}
                                value={_title}
                            />
                        </Col>
                        <Col lg="2">
                            <Button type="submit" className="mb-2" >
                                Gönder
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Modal.Footer>Eksi konuşma başlığını yeniden adlandırabilirsin</Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}
