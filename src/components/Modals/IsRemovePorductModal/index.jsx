import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
export default function IsRemovePorductModal({  }) {
    const [active, setActive] = useState(false);
    const { closeModal,isOpen, modals } = useModal();


    return (
        <Modal
            show={isOpen("isRemoveProduct")}
            onHide={() => closeModal("isRemoveProduct")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Bu ürünü sil
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bu ürünü Silmek istediğinizden eminmisiniz.

                <div className="settings-button-container">
                    <button className="regular-button">Vazgeç</button>
                    <button className="delete-button">ürünü sil</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
