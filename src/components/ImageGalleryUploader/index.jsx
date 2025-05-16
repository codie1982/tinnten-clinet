import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadMultipleImage, resetUpload } from "../../api/upload/uploadSlicer";
import { toast } from "react-toastify";
import { Row, Col, Spinner, ProgressBar, Carousel } from "react-bootstrap";

export default function ImageGalleryUploader({ uploaderId, onAllImagesUploaded, initialImages, companyid }) {
    const dispatch = useDispatch();
    const [gallery, setGallery] = useState(initialImages || []);
    const [imageIndex, setImageIndex] = useState(0);

    const uploadState = useSelector((state) => {
        console.log("state", state)
        return state.upload?.[uploaderId] || {}
    });
    console.log("📦 uploaderId:", uploaderId);
    console.log("📦 Redux uploads[uploaderId]:", uploadState);
    const {
        isLoading,
        isSuccess,
        isError,
        images,
        successCount,
        failureCount,
        totalFiles,
        error
    } = uploadState;

    useEffect(() => {
        setGallery(initialImages || []);
    }, [initialImages]);

    useEffect(() => {
        resetUpload()
    }, [])

    useEffect(() => {
        if (!isLoading && isSuccess && Array.isArray(images)) {
            setGallery(images);

            const success = successCount ?? images.length;
            const fail = failureCount ?? 0;
            const total = totalFiles ?? success + fail;

            if (fail === total) {
                toast.error(`${fail} dosya başarısız yüklendi.`);
            } else if (success === total) {
                toast.success(`${success} başarılı olmak üzere toplam ${total} dosya yüklendi.`);
            } else {
                toast.info(`${success} başarılı, ${fail} başarısız dosya yüklendi.`);
            }
            const updatedGallery = [...gallery, ...images];
            setGallery(updatedGallery);
            if (onAllImagesUploaded) {
                onAllImagesUploaded(uploaderId, updatedGallery);
            }
        }

        if (!isLoading && isError) {
            toast.error(`Yükleme sırasında hata oluştu: ${error || "Bilinmeyen hata"}`);
        }
    }, [images, isError, isSuccess, isLoading]);

    const onDrop = useCallback((acceptedFiles) => {
        console.log("🧲 onDrop tetiklendi. Seçilen dosyalar:", acceptedFiles);

        const formData = new FormData();
        formData.append("companyid", companyid);

        acceptedFiles.forEach((file) => {
            console.log("📁 Dosya eklendi:", file.name);
            formData.append("files", file);
        });

        console.log("🚀 Dispatch başlatılıyor:", uploaderId);
        dispatch(uploadMultipleImage({ uploaderId, files: formData }));
    }, [dispatch, companyid, uploaderId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        onDrop,
    });

    const handleImageSelect = (index) => {
        setImageIndex(index);
    };
    const handleDelete = (e, index) => {
        e.stopPropagation(); // Carousel resmini seçmesini engeller
        const newGallery = gallery.filter((_, i) => i !== index);
        setGallery(newGallery);
        if (onAllImagesUploaded) {
            onAllImagesUploaded(uploaderId, newGallery);
        }
        // Seçili görsel silinmişse index sıfırlansın
        if (index === imageIndex) {
            setImageIndex(0);
        } else if (index < imageIndex) {
            setImageIndex(imageIndex - 1); // Önceki bir görsel silindiyse index'i kaydır
        }
    };
    return (
        <div className="image-gallery-uploader">
            {isLoading && (
                <div className="upload-loader-wrapper text-center my-3">
                    <Spinner animation="border" role="status" variant="primary" />
                    <div>Yükleme devam ediyor...</div>
                </div>
            )}

            {gallery.length === 0 && (
                <div {...getRootProps()} className={`upload-drag-area ${isDragActive ? "active" : ""}`}>
                    <input {...getInputProps()} />
                    <p>Resimleri buraya sürükleyin ya da tıklayarak seçin</p>
                </div>
            )}

            {gallery.length > 0 && (
                <>
                    <Row>
                        <Col className="image-section">
                            <div className="product-gallery-carousel-wrapper">
                                <Carousel
                                    activeIndex={imageIndex}
                                    onSelect={handleImageSelect}
                                    indicators={false}
                                    controls={true}
                                    fade={true}
                                    className="product-carousel"
                                >
                                    {gallery.map((item, index) => (
                                        <Carousel.Item key={item.path} className="carousel-item-wrapper">
                                            <div className="carousel-image-container">
                                                <img
                                                    src={item.path}
                                                    alt={`Yüklenen ${index + 1}`}
                                                    className="carousel-image"
                                                />
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ul className="product-detail-image-list">
                                {gallery.map((item, index) => (
                                    <li key={item.path} className={index === imageIndex ? "active" : ""}>
                                        <button className="delete-image-button" onClick={(e) => handleDelete(e, index)}>×</button>
                                        <img src={item.path} onClick={() => handleImageSelect(index)} />
                                    </li>
                                ))}

                                {/* Yeni Resim Ekle */}
                                <li className="image-add-button" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <span>＋</span>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}