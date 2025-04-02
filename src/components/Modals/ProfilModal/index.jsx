import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, ButtonGroup, Row, Col, Image, Spinner } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate, } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';

import { uploadprofileimage } from "../../../api/upload/uploadSlicer"
import { updateProfile } from "../../../api/profile/profileSlicer"
import LazyImage from '../../Common/LazyImage'
import { use } from 'i18next'
import { toast } from 'react-toastify'


export default function ProfilComponent({ isOpen, setOpenModal, userProfile, isProfileLoading }) {
    const [active, setActive] = useState(false);
    const [t, i18n] = useTranslation("global")
    const dispatch = useDispatch()
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



    useEffect(() => {
        setUserProfile(userProfile)
        setProfileImg(userProfile?.profileImage?.path);
        setUploadid(userProfile?.profileImage._id);
    }, [userProfile])

    useEffect(() => {
        if (isLoading === false && isSuccess === true && newImage !== null) {
            console.log("newImage", newImage)
            setProfileImg(newImage?.path);
            setUploadid(newImage?._id);
        }
    }, [isLoading, isSuccess, isError, newImage])


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

        // Retrieve raw input values
        const formProfileImage = formData.get("profileImage") || "";
        const formFirstname = formData.get("firstname") || "";
        const formLastname = formData.get("lastname") || "";
        const formBirthdate = formData.get("birthdate") || "";
        const formBio = formData.get("bio") || "";
        const formGender = formData.get("gender") || "";

        // Get original values from userProfile prop (using _userProfile state)
        const originalProfileImage = _userProfile?.profileImage?._id || "";
        const originalFirstname = _userProfile?.firstname || _userProfile?.given_name || "";
        const originalLastname = _userProfile?.lastname || _userProfile?.family_name || "";
        const originalBirthdate = _userProfile?.birthdate ? _userProfile.birthdate.substring(0, 10) : "";
        const originalBio = _userProfile?.bio || "";
        const originalGender = _userProfile?.gender || "pointout";

        // Check if there are any changes
        if (
            formProfileImage === originalProfileImage &&
            formFirstname === originalFirstname &&
            formLastname === originalLastname &&
            formBirthdate === originalBirthdate &&
            formBio === originalBio &&
            formGender === originalGender
        ) {
            toast.error("Değişiklik yok, güncelleme yapılmayacak.");
            console.log("No changes detected, update will not be dispatched.");
            return;
        }

        // Convert the birthdate to ISO format if provided
        if (formBirthdate) {
            formData.set("birthdate", new Date(formBirthdate).toISOString());
        }

        const data = {
            profileImage: formProfileImage,
            firstname: formFirstname,
            lastname: formLastname,
            birthdate: formBirthdate,
            bio: formBio,
            gender: formGender
        };

        console.log("jsonData", JSON.stringify(data, null, 2));
        dispatch(updateProfile(formData));
    }


    return (
        <Modal
            size="lg"
            show={isOpen}
            onHide={() => setOpenModal(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className="feature-plan-container" closeButton>
                <Modal.Title className="feature-plan-title" id="example-modal-sizes-title-lg">
                    <h3>{t("profile.title")}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="settings-container">
                    <div className="container-fluid">
                        <Form onSubmit={handleSubmitForm}>
                            {/* Profile image selection */}
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalProfile">
                                <input type="hidden" name="profileImage" value={uploadid} />
                                <Col className="flex justify-center align-middle" sm={10}>
                                    <Row>
                                        <Col>
                                            <div className="profile-image-container" onClick={handleImageClick}>
                                                {isLoading ?
                                                    <div style={{ width: "100px", height: "100xp" }}>
                                                        <Spinner animation="border" />
                                                    </div> :
                                                    <Image
                                                        src={profileImg}
                                                        roundedCircle
                                                        className="profile-image"
                                                        style={{ width: "100px", height: "100px" }}
                                                    />}

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
                                                    <Button className="col btn m-t-2 btn-block btn-google-login" variant="primary" onClick={handleSubmitProfileImage}>
                                                        Güncelle
                                                    </Button>

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
                                    <Button className="col btn m-t-2 btn-block btn-google-login" disabled={isProfileLoading} type="submit">
                                        {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
