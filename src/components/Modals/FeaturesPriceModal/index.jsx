import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap'

export default function FeaturesPriceModal({ isModalOpen, setIsModalOpen }) {
    const [active, setActive] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit')
    }
    return (
        <Modal
            size="xl"
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Planını Yükselt
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="toggle-content">
                    <div
                        className={`toggle-container ${active ? "active" : ""}`}
                        onClick={() => setActive(!active)}
                    >
                        <div className="toggle-slider"></div>
                        <div className="toggle-option">Personal</div>
                        <div className="toggle-option">Business</div>
                    </div>
                </div>


                {active ?
                    <>
                        <div className="feature-plan-body">
                            <div className="feature-plan-frame">
                                <div className="feature-plan-title">
                                    <h2>Firmalar için</h2>
                                    <p>firmanızı ürünlerini ve hizmetlerinizi ekleyin.</p>
                                </div>
                                <div className="feature-plan-price ">
                                    <div className="text-section d-flex">
                                        <h3 className="text-helper"><FontAwesomeIcon icon={faDollar} /><span className="" style={{ textDecoration: "line-through" }}>99</span></h3>
                                        <h3 className="text-price">Ücretsiz</h3>
                                    </div>
                                    <p>Aylık</p>
                                </div>
                                <div className="feature-plan-body">
                                    <ul>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>Firmanı ve hizmetlerini ekleyin</span></li>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>firma içeriklerinizi ve dökümanlarınızı , PDF dosyalarını ekleyin </span></li>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>Tinnten sizi iyi tanımalı ve kullanıcı sorularına sizin ile ilgili cevaplar verebilmeli</span></li>
                                    </ul>
                                </div>
                                <Button className='feature-plan-button pro' variant="secondary" >Kayıt oluştur</Button>
                            </div>
                            <div className="feature-plan-frame">
                                <div className="feature-plan-title">
                                    <h2>Firmalar için</h2>
                                    <p>firmanızı ürünlerini ve hizmetlerinizi ekleyin.</p>
                                </div>
                                <div className="feature-plan-price ">
                                    <div className="text-section d-flex">
                                        <h3 className="text-helper"><FontAwesomeIcon icon={faDollar} /><span className="" style={{ textDecoration: "line-through" }}>99</span></h3>
                                        <h3 className="text-price"><FontAwesomeIcon icon={faDollar} />49</h3>
                                    </div>
                                    <p>Aylık</p>
                                </div>
                                <div className="feature-plan-body">
                                    <ul>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>Firmanı ve hizmetlerini ekleyin</span></li>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>firma içeriklerinizi ve dökümanlarınızı , PDF dosyalarını ekleyin </span></li>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>Tinnten sizi iyi tanımalı ve kullanıcı sorularına sizin ile ilgili cevaplar verebilmeli</span></li>
                                    </ul>
                                </div>
                                <Button className='feature-plan-button pro' variant="secondary" >Kayıt oluştur</Button>
                            </div>
                            <div className="feature-plan-frame">
                                <div className="feature-plan-title">
                                    <h2>Firmalar için</h2>
                                    <p>firmanızı ürünlerini ve hizmetlerinizi ekleyin.</p>
                                </div>
                                <div className="feature-plan-price ">
                                    <div className="text-section d-flex">
                                        <h3 className="text-helper"><FontAwesomeIcon icon={faDollar} /><span className="" style={{ textDecoration: "line-through" }}>199</span></h3>
                                        <h3 className="text-price"><FontAwesomeIcon icon={faDollar} />149</h3>
                                    </div>
                                    <p>Aylık</p>
                                </div>
                                <div className="feature-plan-body">
                                    <ul>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>Firmanı ve hizmetlerini ekleyin</span></li>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>firma içeriklerinizi ve dökümanlarınızı , PDF dosyalarını ekleyin </span></li>
                                        <li> <FontAwesomeIcon icon={faCheck} /> <span>Tinnten sizi iyi tanımalı ve kullanıcı sorularına sizin ile ilgili cevaplar verebilmeli</span></li>
                                    </ul>
                                </div>
                                <Button className='feature-plan-button pro' variant="secondary" >Kayıt oluştur</Button>
                            </div>

                        </div>
                    </>
                    :
                    <>
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
                    </>
                }

            </Modal.Body>
        </Modal>
    )
}
