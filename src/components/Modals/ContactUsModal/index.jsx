import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
export default function ContactUsModal({ }) {
    const [active, setActive] = useState(false);
    const { closeModal, isOpen, modals } = useModal();

    return (
        <Modal
            size="xl"
            show={isOpen("contactus")}
            onHide={() => closeModal("contactus")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Bizimle İletişime geçin
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bizimle İletişime geçmek için lütfen aşağıdaki formu doldurun. En kısa sürede sizinle iletişime geçeceğiz.
            </Modal.Body>
        </Modal>
    )
}
