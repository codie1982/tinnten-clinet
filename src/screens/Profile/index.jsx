import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';

import useAgentSocket from "../../hooks/useAgentSocket";
import { uploadprofileimage } from "../../api/upload/uploadSlicer"
import { updateProfile } from "../../api/profile/profileSlicer"
import { toast } from 'react-toastify'
import { useModal } from '../../components/Modals/ModalProvider'
import tinntenLogo from "../../assets/char-logo.png"
import UserPackagesModal from "../../components/Modals/UserPackagesModal";
export default function CompanyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const { openModal } = useModal();

  const [t, i18n] = useTranslation("global")
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
  const { isLoading: isProfileLoading, isSuccess: isSuccessProfile, isError: isErrorProfile, userProfile, message } = useSelector((state) => state.profile);



  useEffect(() => {
    setUserProfile(userProfile)
    if (userProfile?.profileImage != null && userProfile?.profileImage?.path != null) {
      setProfileImg(userProfile?.profileImage?.path);
    } else {
      setProfileImg(tinntenLogo);
    }

    setUploadid(userProfile?.profileImage?._id);
  }, [isProfileLoading, isSuccessProfile, isErrorProfile, userProfile, message])

  useEffect(() => {
    if (isLoading === false && isSuccess === true && newImage !== null) {
      console.log("newImage", newImage)
      setProfileImg(newImage?.path);
      setUploadid(newImage?._id);
    }
  }, [isLoading, isSuccess, isError, newImage])




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
    <div className="form-section">
      <div className="form-content form-content-left-side form-content-flwx-one">
        <div className="form-container">
          <div className="container-fluid">

            <div className="form-header">
              <h2 className="form-title form-title-start">{t("profile.title")}</h2>
              <h2 className="form-description form-description-start">{t("profile.description")}</h2>
            </div>
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
              <Form.Group as={Row} className="mb-3" controlId="formHorizontalPackage">
                <Form.Label column sm={2}>
                  Plan
                </Form.Label>
                <Col sm={6}>
                  <p>Ücretsiz Plan</p>
                </Col>
                <Col sm={4}>
                  <Button className="col btn m-t-2 btn-block btn-google-login" onClick={() => { openModal("userPackages") }}>
                    Paketleri Gör
                  </Button>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 2 }}>
                  <Button className="col btn m-t-2 btn-block btn-google-login" disabled={isProfileLoading} type="submit">
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      <UserPackagesModal />
    </div>
  );
}