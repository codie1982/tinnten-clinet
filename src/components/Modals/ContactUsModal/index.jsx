import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'

export default function ContactUsModal({ isOpen, setOpenModal }) {
    const [active, setActive] = useState(false);


    return (
        <Modal
            size="xl"
            show={isOpen}
            onHide={() => setOpenModal(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Profil Bilgileri
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ProfilComponent
            </Modal.Body>
        </Modal>
    )
}
