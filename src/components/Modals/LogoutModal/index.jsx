import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'
import { useAuth } from '../../../context/authContext'
import { useModal } from '../ModalProvider'
export default function LogoutModal({ setOpenModal }) {
    const { isLogin, isLoading, logoutApplication } = useAuth()
    const { closeModal,isOpen, modals } = useModal();
    const setLogout = () => {
        // Burada logout işlemini yaparsın
        console.log("Çıkış yapılıyor...");
        //closeModal("logout"); // Modalı kapat
        //logoutApplication()
    };

    return (
        <>
            <Modal
                size="xl"
                show={isOpen("logout")}
                onHide={() => closeModal("logout")}
                aria-labelledby="example-modal-sizes-title-lg plans-container"
            >
                <Modal.Header className="feature-plan-container" closeButton>
                    <Modal.Title className="feature-plan-title" id="example-modal-sizes-title-lg">
                        Çıkış yap
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Çıkış yapmak istediğinizden emin misiniz?
                    <div className="settings-button-container">
                        <button className="regular-button" onClick={() => closeModal("logout")}>Vazgeç</button>
                        <button className="delete-button" onClick={setLogout}>Çıkış yap</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
