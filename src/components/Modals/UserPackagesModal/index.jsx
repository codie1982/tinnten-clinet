import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
export default function UserPackagesModal() {
    const [active, setActive] = useState(false);
    const { closeModal, isOpen, modals } = useModal();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit')
    }
    return (
        <Modal
            size="xl"
            show={isOpen("userPackages")}
            onHide={() => closeModal("userPackages")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Planını Yükselt
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="feature-plan-body">
                    <div className="feature-plan-frame">
                        <div className="feature-plan-title">
                            <h2>Standart</h2>
                            <p>Start for free, no credit card needed.</p>
                        </div>
                        <div className="feature-plan-price">
                            <h3>Free</h3>
                            <p>Sonsuza kadar</p>
                        </div>
                        <Button className='feature-plan-button free' variant="secondary" disabled>Mevcut Plan</Button>
                        <div className="feature-plan-body">
                            <ul>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>Unlimited free searches</span></li>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>3 Pro searches per day</span></li>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>Fast free AI model</span></li>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>Upload 3 files per day</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="feature-plan-frame">
                        <div className="feature-plan-title">
                            <h2>Proffesional</h2>
                            <p>Unlock the full capabilities of Perplexity and enjoy new perks as they are added.</p>
                        </div>
                        <div className="feature-plan-price">
                            <h3><FontAwesomeIcon icon={faDollar} />20</h3>
                            <p>Aylık</p>
                        </div>
                        <Button className='feature-plan-button pro' variant="secondary" >Yükselt</Button>
                        <div className="feature-plan-body">
                            <ul>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>create spaces</span></li>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>unlimited pro search </span></li>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>Fast free AI model</span></li>
                                <li> <FontAwesomeIcon icon={faCheck} /> <span>unlimited Upload files</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
