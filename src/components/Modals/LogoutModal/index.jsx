import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'
import { useAuth } from '../../../context/authContext'

export default function LogoutModal({ isOpen, setOpenModal }) {
    const { isLogin, isLoading, logout } = useAuth()

    const [active, setActive] = useState(false);

    const setLogout = () => {
        if (isLogin) {
            logout()
        }
    }
    return (
        <Modal
            size="xl"
            show={isOpen}
            onHide={() => setOpenModal(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Çıkış yap
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Çıkış yapmak istedinizden emin misiniz?
                <div className="settings-button-container">
                    <button className="regular-button">Vazgeç</button>
                    <button className="delete-button" onClick={setLogout}>Çıkış yap</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
