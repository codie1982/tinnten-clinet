import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'

export default function ProfilComponent({ isOpen, setOpenModal }) {
    const [active, setActive] = useState(false);


    return (
        <Modal
            size="lg"
            show={isOpen}
            onHide={() => setOpenModal(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    <div className="toggle-content">
                        <div
                            className={`toggle-container ${active ? "active" : ""}`}
                            onClick={() => setActive(!active)}
                        >
                            <div className="toggle-slider"></div>
                            <div className="toggle-option">Profil</div>
                            <div className="toggle-option">Ayarlar</div>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="settings-container">
                    <div className="settings-card">
                        <h2 className="settings-title">Ayarlar</h2>
                        <div className="settings-content">
                            <div className="settings-item">
                                <span className="settings-item-title">Language</span>
                                <select className="settings-select">
                                    <option value="1">System</option>
                                    <option value="2">Türkçe</option>
                                    <option value="3">English</option>
                                </select>
                            </div>
                            <div className="settings-item">
                                <span className="settings-item-title">Theme</span>
                                <select className="settings-select">
                                    <option value="1">System</option>
                                    <option value="2">Light</option>
                                    <option value="3">Dark</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
