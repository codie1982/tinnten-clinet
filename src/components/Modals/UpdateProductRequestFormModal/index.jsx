import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
export default function UpdateProductRequestFormModal({ productid }) {
    const [active, setActive] = useState(false);
    const { closeModal, isOpen, modals } = useModal();


    return (
        <Modal
            show={isOpen("updateProductRequestForm")}
            onHide={() => closeModal("updateProductRequestForm")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Ürünü güncelle
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Ürün İstek formu güncellenecek.{productid}

                <div className="settings-button-container">
                    <button className="regular-button">Güncelle</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
