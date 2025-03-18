import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'

export default function AllDeleteModal({ isOpen, setOpenModal }) {
    const [active, setActive] = useState(false);


    return (
        <Modal
            size="xl"
            show={isOpen}
            onHide={() => setOpenModal(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Delete all chats
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                you confirm deletion, all chat history for this account will be permanently erased and cannot be recovered.
                Are you sure you want to delete all chat history?

                <div className="settings-button-container">
                    <button className="regular-button">Cancel</button>
                    <button className="delete-button">Delete Account</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
