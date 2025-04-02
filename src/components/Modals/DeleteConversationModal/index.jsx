import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, Row, Col, } from 'react-bootstrap'

export default function DeleteConversationModal({ isModalOpen, setIsModalOpen,onConfirm }) {
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
                <Modal.Title>Emin misin?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                    <Row className="align-items-center mb-2">
                        <Col lg="10" >
                            <Form.Label htmlFor="inlineFormInput" >
                                Silmek istediğinden eminmisin
                            </Form.Label>
                
                        </Col>
                        <Col lg="2">
                            <Button variant='danger' onClick={onConfirm}>Evet, Sil</Button>
                        </Col>
                    </Row>
                <Modal.Footer>Bu konuşma kalıcı olarak kaldırılacaktır</Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}
