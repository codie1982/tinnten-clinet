import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Form, ButtonGroup, Row, Col, Image, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../context/authContext'
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../ModalProvider'
import { logoutUser, axiosTest } from '../../../api/auth/authSlicer'
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
export default function WaitlistModal({ }) {
    const dispatch = useDispatch();
    const { closeModal, isOpen, closeAllModals } = useModal();
    const { user, settings } = useAuth()
    const [uploadid, setUploadid] = useState("")

    const [profileImg, setProfileImg] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [_userProfile, setUserProfile] = useState()
    const fileInputRef = useRef(null);
    const defaultGender = _userProfile?.gender || "pointout";

    const { isLoading, isSuccess, isError, image: newImage } = useSelector(
        (state) => { return state.upload }
    )

    const handleSubmitForm = () => {

    }


    return (
        <Modal
            size="md"
            show={isOpen("waitlist")}
            onHide={() => closeModal("waitlist")}
            aria-labelledby="modal-logout"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="modal-logout">Bekleme Listesi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="settings-container">
                    <div className="container-fluid">
                        <Form onSubmit={handleSubmitForm}>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>
                                    Email
                                </Form.Label>
                                <Col sm={10}>
                                    <Row>
                                        <Col>
                                            <p>{user.email}</p>
                                        </Col>
                                        <Col>
                                            <span>
                                                <FontAwesomeIcon size="lg" color="#656565" icon={faCheck} />
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
                                <Form.Label column sm={2}>
                                    Adınız
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        name="firstname"
                                        defaultValue={_userProfile?.firstname || _userProfile?.given_name || ""}
                                        placeholder="Adınız"
                                    />
                                </Col>
                                <Col sm={5}>
                                    <Form.Control
                                        name="lastname"
                                        defaultValue={_userProfile?.lastname || _userProfile?.family_name || ""}
                                        placeholder="Soyadınız"
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalBio">
                                <Form.Label column sm={2}>
                                    Açıklama
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        name="bio"
                                        as="textarea"
                                        defaultValue={_userProfile?.bio || ""}
                                        placeholder="Kendiniz hakkında bilgi"
                                        rows={3}
                                    />
                                    <Form.Text>
                                        Tinnten'nin sizi tanıması için kendiniz hakkında birkaç kelime yazın.
                                    </Form.Text>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalBirthdate">
                                <Form.Label column sm={2}>
                                    Doğum Tarihi
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="date"
                                        name="birthdate"
                                        defaultValue={_userProfile?.birthdate ? _userProfile.birthdate.substring(0, 10) : ""}
                                        placeholder="Doğum Tarihi"
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalGender">
                                <Form.Label column sm={2}>
                                    Cinsiyet
                                </Form.Label>
                                <Col sm={10}>
                                    <div className="d-flex">
                                        <Form.Check
                                            type="radio"
                                            label="Kadın"
                                            name="gender"
                                            value="woman"
                                            id="gender-woman"
                                            defaultChecked={defaultGender === "woman"}
                                            className="ms-1 me-3"
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Erkek"
                                            name="gender"
                                            value="man"
                                            id="gender-man"
                                            defaultChecked={defaultGender === "man"}
                                            className="me-3"
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Belirtmek İstemiyorum"
                                            name="gender"
                                            value="pointout"
                                            id="gender-pinout"
                                            defaultChecked={defaultGender === "pointout"}
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col sm={{ span: 10, offset: 2 }}>
                                    <Button className="col btn m-t-2 btn-block btn-google-login" disabled={false} type="submit">
                                        {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => closeModal("logout")}>
                    Vazgeç
                </Button>
                <Button
                    variant="danger"
                    onClick={"handleLogout"}
                    disabled={"isLoading"}
                >
                    {false ? (
                        <>
                            <Spinner animation="border" size="sm" /> Çıkış yapılıyor...
                        </>
                    ) : (
                        "Kaydet"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}