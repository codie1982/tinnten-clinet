import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'
import { useAuth } from 'context/authContext';
import { useModal } from '../ModalProvider'

export default function SettingsComponent({ }) {
    const [active, setActive] = useState(false);
    const { settings } = useAuth()
    const { closeModal, isOpen, modals } = useModal();

    const handleSelectedLanguage = (e) => {
        console.log("handleSelectedLanguage", e.target.value)
    }
    return (
        <Modal
            size="xl"
            show={isOpen("settings")}
            onHide={() => closeModal("settings")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Ayarlar
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="settings-container">
                    <div className="settings-card">
                        <h2 className="settings-title">Ayarlar</h2>
                        <div className="settings-content">
                            <div className="settings-item">
                                <span className="settings-item-title" onSelect={(e) => { handleSelectedLanguage(e) }}>Language</span>
                                <select className="settings-select">
                                    <option value="1">System</option>
                                    <option value="tr">Türkçe</option>
                                    <option value="en">İngilizce</option>
                                </select>
                            </div>
                        </div>
                        <div className="settings-footer">
                            <button className="delete-button">Delete Account</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
