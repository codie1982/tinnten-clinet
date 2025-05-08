import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, Image } from "react-bootstrap";
import { uploadprofileimage } from "../../api/upload/uploadSlicer";
import tinntenLogo from "../../assets/char-logo.png"

export default function LogoImageUploader({ initialImage, onImageUploaded }) {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const { isLoading, isSuccess, image: newImage } = useSelector((state) => state.upload);

    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImg, setProfileImg] = useState(
        initialImage && initialImage.path ? initialImage.path : tinntenLogo
    );

    useEffect(() => {
        if (isSuccess && newImage && newImage.path) {
            setProfileImg(newImage.path);
            if (onImageUploaded) {
                onImageUploaded(newImage);
            }
        }
    }, [isSuccess, newImage, onImageUploaded]);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                const img = new window.Image();
                img.onload = () => {
                    if (img.naturalWidth !== 1000 || img.naturalHeight !== 1000) {
                        console.warn("Tavsiye edilen boyut: 1000x1000, ancak farklı.");
                    }
                    setProfileImg(url);
                    setSelectedFile(file);
                };
                img.src = url;
            } else {
                alert("Lütfen geçerli bir resim dosyası seçin.");
            }
        }
    };

    const handleSubmitProfileImage = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("files", selectedFile);
            dispatch(uploadprofileimage(formData));
            setSelectedFile(null);
        }
    };

    return (
        <div className="profile-image-wrapper">
            <div className="profile-image-container" onClick={handleImageClick}>
                {isLoading ? (
                    <div style={{ width: "100px", height: "100px" }}>
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Image
                        src={profileImg}
                        roundedCircle
                        className="profile-image"
                        style={{ width: "100px", height: "100px" }}
                    />
                )}
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
                    <Button
                        className="col btn m-t-2 btn-block btn-google-login"
                        variant="primary"
                        onClick={handleSubmitProfileImage}
                    >
                        Güncelle
                    </Button>
                </div>
            )}
        </div>
    );
};