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
export default function BuisnessPackage() {
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
  );
}