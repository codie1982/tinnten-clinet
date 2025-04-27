import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
export default function AllDeleteModal({  }) {
    const [active, setActive] = useState(false);
    const { closeModal,isOpen, modals } = useModal();


    return (
        <Modal
            size="xl"
            show={isOpen("deleteallchats")}
            onHide={() => closeModal("deleteallchats")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Tüm konuşmaları Sil
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Silme işlemini onaylarsanız, bu hesap için tüm chat geçmişi kalıcı olarak silinecektir
                ve geri getirilemeyecektir. Tüm chat geçmişini silmek istediğinizden emin misiniz?

                <div className="settings-button-container">
                    <button className="regular-button">Vazgeç</button>
                    <button className="delete-button">Tüm Konuşmaları Sil</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
