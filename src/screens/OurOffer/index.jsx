import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar } from '@fortawesome/free-solid-svg-icons'
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
import BuisnessPackage from "../../screens/BuisnessPackage";
export default function OurOffer() {
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
            <Row>
              <Col className="flex justify-center align-middle" sm={8}>
                <div className="form-header">
                  <h1 className="form-title form-title-start">{"Firmanı Ekleyebilirsin"}</h1>
                  <h2 className="form-description form-description-start">{"Tinnten iş sahipleri için ürün ve hizmetlerini ekleyebildikleri bir platformdur. Firma detaylarınızı ürün ve hizmetlerinizi ekleyip kullanıcıların sorgularında sizin ürün ve hizmetlerinin tavsiye edilmesini sağlayabilirsiniz."}</h2>
                  <h3 className="form-description form-description-start">{"Kendine bir Firma Profili oluştur ve teklif almak istediğin ürünlerini, ilanlarını, kiralamalarını veya verdiğin hizmetleri hizmet bölgelerini ekleyebilirsin."}</h3>
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="flex justify-center align-middle" sm={10}>
                <BuisnessPackage />
              </Col>
            </Row>
            <Row>
              <Col className="" lg={4}>
                <Button className='btn btn-lg btn-block' variant="secondary" >Bu Adımı Geç</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>

    </div>
  );
}