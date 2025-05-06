import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import BuisnessPackage from '../../../screens/BuisnessPackage'
export default function BuisnessPackageModal() {

    const { closeModal, isOpen } = useModal();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit')
    }
    return (
        <Modal
            size="xl"
            show={isOpen("buissnessPackages")}
            onHide={() => closeModal("buissnessPackages")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Planını Yükselt
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BuisnessPackage />
            </Modal.Body>
        </Modal>
    )
}
