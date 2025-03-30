import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup, Row, Col, Image } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate, } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';

import { uploadprofileimage } from "../../../api/upload/uploadSlicer"
import { updateProfile } from "../../../api/profile/profileSlicer"
import LazyImage from '../Common/LazyImage'

export default function ProfilComponent({ isOpen, setOpenModal }) {
    const [active, setActive] = useState(false);
    const [t, i18n] = useTranslation("global")
    const dispatch = useDispatch()
    const { user, profiles, settings } = useAuth()
    const [imageid, setImageid] = useState("")
    const initialProfileImg = "https://lh3.googleusercontent.com/a/ACg8ocK5AcLNndhbXFi8sdw_mo3b3EgkfRZgOOfS77dffHPVj56OswzN=s96-c";
    const [profileImg, setProfileImg] = useState(initialProfileImg);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const defaultGender = profiles?.gender || "pinout";

    const { isLoading, isSuccess, isError, image: newImage } = useSelector(
        (state) => {
            return state.upload
        }
    )

    const { isLoading: isPLoading, isSuccess: isPSuccess, isError: isPError, profile: nProfile } = useSelector(
        (state) => {
            return state.profile
        }
    )

    useEffect(() => {
        console.log("isLoading, isSuccess, isError, newImage", isLoading, isSuccess, isError, newImage)
        if (isLoading === false && isSuccess === true && newImage !== null) {
            console.log("newImage", newImage)
            setProfileImg(newImage?.path);
            setImageid(newImage?.uploadid);
        }
    }, [isLoading, isSuccess, isError, newImage])

    useEffect(() => {
        if (isPLoading === false && isPSuccess === true && nProfile !== null) {
            console.log("nProfile", nProfile)

        }
    }, [nProfile])

    const navigate = useNavigate()


    const handleImageClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                const img = new window.Image();
                img.onload = () => {
                    if (img.naturalWidth !== 1000 || img.naturalHeight !== 1000) {
                        console.warn("Tavsiye edilen boyut: 1000x1000, ancak seçilen resmin boyutu farklı.");
                    }
                    setProfileImg(url);
                    setSelectedFile(file);
                };
                img.src = url;
            } else {
                alert("Lütfen geçerli bir resim dosyası seçin.");
            }
        }
    }

    const handleSubmitProfileImage = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("files", selectedFile);
            dispatch(uploadprofileimage(formData));
            setSelectedFile(null);
        }
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Convert the birthdate to ISO format if provided
        const bd = formData.get("birthdate");
        if (bd) {
            formData.set("birthdate", new Date(bd).toISOString());
        }

        const data = {
            imageid: imageid,
            firstname: formData.get("firstname"),
            lastname: formData.get("lastname"),
            birthdate: formData.get("birthdate"),
            bio: formData.get("bio"),
            gender: formData.get("gender")
        };

        console.log("jsonData", JSON.stringify(data, null, 2));
        dispatch(updateProfile(formData));
    }

    const handleClearProfileImage = () => {
        setProfileImg(initialProfileImg);
        setSelectedFile(null);
    }

    console.log("profiles", profiles)
    console.log("user", user)
    return (
        <Modal
            size="lg"
            show={isOpen}
            onHide={() => setOpenModal(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    <h3>{t("profile.title")}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="settings-container">
                    <div className="container-fluid">
                        <Form onSubmit={handleSubmitForm}>
                            {/* Profile image selection */}
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalProfile">
                                <input type="hidden" value={imageid} />
                                <Col className="flex justify-center align-middle" sm={10}>
                                    <Row>
                                        <Col>
                                            <div className="profile-image-container" onClick={handleImageClick}>
                                                <LazyImage
                                                    src={profileImg}
                                                    alt="Profile"
                                                    className="profile-image"
                                                />
                                                <div className="profile-overlay">Düzenle</div>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden-file-input"
                                            />
                                            {selectedFile && (
                                                <div className="profile-action-buttons" style={{ marginTop: "10px" }}>
                                                    <Button className='col btn m-t-2 btn-block btn-google-login' variant="primary" onClick={handleSubmitProfileImage}>Güncelle</Button>
                                                    <Button variant="danger" onClick={handleClearProfileImage} style={{ marginLeft: "10px" }}>Sil</Button>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>
                                    Email
                                </Form.Label>
                                <Col sm={10}>
                                    <Row>
                                        <Col>
                                            <p>engin_erol@hotmail.com</p>
                                        </Col>
                                        <Col>
                                            <span><FontAwesomeIcon size='lg' color='#656565' icon={faCheck} /></span>
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
                                        defaultValue={profiles?.firstname || user?.given_name || ""}
                                        placeholder="Adınız"
                                    />
                                </Col>
                                <Col sm={5}>
                                    <Form.Control
                                        name="lastname"
                                        defaultValue={profiles?.lastname || user?.family_name || ""}
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
                                        defaultValue={profiles?.bio || ""}
                                        placeholder="Kendiniz hakkında bilgi"
                                        rows={3}
                                    />
                                    <Form.Text>Tinnten'nin sizi tanıması için kendiniz hakkında birkaç kelime yazın.</Form.Text>
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
                                        defaultValue={profiles?.birthdate ? profiles.birthdate.substring(0, 10) : ""}
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
                                    <Button className="col btn m-t-2 btn-block btn-google-login" type="submit">Güncelle</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}