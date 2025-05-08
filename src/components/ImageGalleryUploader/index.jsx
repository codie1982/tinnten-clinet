import React, { useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Carousel, Row, Col, ProgressBar } from "react-bootstrap";
import { Button, Spinner, Image } from "react-bootstrap";
import { uploadGalleryimage } from "../../api/upload/uploadSlicer";
import tinntenLogo from "../../assets/char-logo.png"

export default function ImageGalleryUploader({ onAllImagesUploaded }) {
    const dispatch = useDispatch();
    const [gallery, setGallery] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [imageIndex, setImageIndex] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const formData = new FormData();
            formData.append("files", file);

            const config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: percentCompleted,
                    }));
                },
            };

            dispatch(uploadGalleryimage(formData));
        });
    }, [gallery, onAllImagesUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        onDrop,
    });

    const handleImageSelect = (index) => {
        setImageIndex(index);
    };

    return (
        <div className="image-gallery-uploader">
            {gallery.length === 0 && (
                <div {...getRootProps()} className={`upload-drag-area ${isDragActive ? "active" : ""}`}>
                    <input {...getInputProps()} />
                    <p>Resimleri buraya sürükleyin ya da tıklayarak seçin</p>
                </div>
            )}

            {Object.keys(uploadProgress).length > 0 && (
                <div className="upload-progress-list">
                    {Object.entries(uploadProgress).map(([filename, progress]) => (
                        <div key={filename}>
                            <small>{filename}</small>
                            <ProgressBar now={progress} label={`${progress}%`} animated striped />
                        </div>
                    ))}
                </div>
            )}

            {gallery.length > 0 && (
                <>
                    <Row>
                        <Col className="image-section">
                            <Carousel activeIndex={imageIndex} onSelect={handleImageSelect} indicators={false} controls={false}>
                                {gallery.map((item) => (
                                    <Carousel.Item key={item.path}>
                                        <img className="d-block w-100" src={item.path} alt="Uploaded" />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ul className="product-detail-image-list">
                                {gallery.map((item, index) => (
                                    <li key={item.path} className={index === imageIndex ? "active" : ""}>
                                        <img
                                            src={item.path}
                                            className="product-image"
                                            onClick={() => handleImageSelect(index)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}