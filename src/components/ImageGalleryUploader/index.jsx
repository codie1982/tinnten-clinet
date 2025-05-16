import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Carousel, Row, Col, ProgressBar } from "react-bootstrap"
import { uploadMultipleImage } from "../../api/upload/uploadSlicer";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

export default function ImageGalleryUploader({ onAllImagesUploaded, initialImages,companyid }) {
    const dispatch = useDispatch();
    const [gallery, setGallery] = useState(initialImages || []);
    const [uploadProgress, setUploadProgress] = useState({});
    const [imageIndex, setImageIndex] = useState(0);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false)
   

    const { data: images, isError, isLoading, isSuccess } = useSelector((state) => {

        return state.upload
    });
    useEffect(() => {
        setGallery(initialImages || []);
      }, [initialImages]);

    useEffect(() => {
        setIsUpdateLoading(isLoading);

        if (!isLoading && isSuccess && !isError && images) {
            console.log("gallery",images?.successfullUploads,images)
            setGallery(images?.successfullUploads || []);

            const success = images?.successCount ?? 0;
            const fail = images?.failureCount ?? 0;
            const total = images?.totalFiles ?? success + fail;
            if(images?.totalFiles == images?.failureCount){
                for(let i = 0;i<images?.failedUploads;i++){
                    toast.error(`${fail} başarısız dosya yüklendi. ${images?.failedUploads[i]?.error}`);
                }
            }else if(images?.totalFiles == images?.successCount){
                toast.success(`${success} başarılı olmak üzere toplam ${total} dosya yüklendi.`);
            }else{
                toast.info(`${fail} başarısız  ve ${success} başarılı olmak üzere toplam ${total} dosya yüklendi.`);
            }
        }
    }, [images, isError, isLoading, isSuccess]);

    useEffect(() => {
        console.log("gallery", gallery)
    }, [gallery])



    const onDrop = useCallback((acceptedFiles) => {
        const formData = new FormData();
        formData.append("companyid", companyid);

        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });

        dispatch(uploadMultipleImage(formData)); // Tek seferde tüm dosyalar
    }, [companyid, dispatch]);

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
            {isUpdateLoading && (
                <div className="upload-loader-wrapper text-center my-3">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </Spinner>
                    <div>Yükleme devam ediyor...</div>
                </div>
            )}
            {gallery?.length === 0 && (
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