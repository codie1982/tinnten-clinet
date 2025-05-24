import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Carousel, Row, Col, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadMultipleFile, resetUpload } from "../../api/upload/uploadSlicer"; // Adjust import path as needed

export default function ImageGalleryUploader({
  uploaderId,
  onAllImagesUploaded,
  initialImages,
  companyid,
  onDeleteImages,
  onOrderChange,
  onDefaultImageSelect
}) {
  const dispatch = useDispatch();
  const [gallery, setGallery] = useState(initialImages || []);
  const [imageIndex, setImageIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [defaultImageId, setDefaultImageId] = useState(null);

  const uploadState = useSelector((state) => state.upload?.[uploaderId] || {});

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
    // Set initial default image if provided
    if (initialImages?.length > 0 && initialImages[0]?._id) {
      setDefaultImageId(initialImages.find(img => img.isDefault)?._id || initialImages[0]._id);
    }
  }, [initialImages]);

  useEffect(() => {
    resetUpload();
  }, []);



  useEffect(() => {
    if (!isLoading && isSuccess && Array.isArray(images)) {
      const existingIds = new Set(gallery.map(img => img._id || img.path));
  
      const newUniqueImages = images.filter(img => !existingIds.has(img._id || img.path));
  
      const updatedGallery = [...gallery, ...newUniqueImages];
  
      setGallery(updatedGallery);
  
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
  
      if (onAllImagesUploaded) {
        onAllImagesUploaded(uploaderId, updatedGallery);
      }
    }
  
    if (!isLoading && isError) {
      toast.error(`Yükleme sırasında hata oluştu: ${error || "Bilinmeyen hata"}`);
    }
  }, [images, isError, isSuccess, isLoading]);
  

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    formData.append("companyid", companyid);

    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    dispatch(uploadMultipleFile({ uploaderId, files: formData }));
  }, [dispatch, companyid, uploaderId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop,
  });

  const handleImageSelect = (index) => {
    setImageIndex(index);
  };

  const handleDelete = (e, index, image) => {
    e.stopPropagation();
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);

    if (onAllImagesUploaded) {
      onAllImagesUploaded(uploaderId, newGallery);
    }

    if (onDeleteImages) {
      onDeleteImages(image._id);
    }

    // Reset default image if deleted
    if (image._id === defaultImageId) {
      const newDefault = newGallery[0]?._id || null;
      setDefaultImageId(newDefault);
      if (onDefaultImageSelect) {
        onDefaultImageSelect(newDefault);
      }
    }

    if (index === imageIndex) {
      setImageIndex(0);
    } else if (index < imageIndex) {
      setImageIndex(imageIndex - 1);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newGallery = [...gallery];
    const [reorderedItem] = newGallery.splice(result.source.index, 1);
    newGallery.splice(result.destination.index, 0, reorderedItem);

    setGallery(newGallery);

    if (onOrderChange) {
      onOrderChange(uploaderId, newGallery);
    }
  };

  const handleDefaultSelect = (e, imageId) => {
    e.stopPropagation();
    setDefaultImageId(imageId);
    if (onDefaultImageSelect) {
      onDefaultImageSelect(imageId);
    }
  };

  return (
    <div className="image-gallery-uploader">
      <div className="edit-mode-toggle mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "Düzenlemeyi Bitir" : "Düzenleme Modu"}
        </button>
      </div>

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
                        {item._id === defaultImageId && (
                          <span className="default-badge">Varsayılan</span>
                        )}
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="gallery" direction="horizontal">
                  {(provided) => (
                    <ul
                      className="product-detail-image-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {gallery.map((item, index) => (
                        <Draggable
                          key={item.path}
                          draggableId={item.path}
                          index={index}
                          isDragDisabled={!isEditMode}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={index === imageIndex ? "active" : ""}
                            >
                              <button
                                className="delete-image-button"
                                onClick={(e) => handleDelete(e, index, item)}
                              >
                                ×
                              </button>
                              {isEditMode && (
                                <button
                                  className={`default-select-button ${item._id === defaultImageId ? "selected" : ""}`}
                                  onClick={(e) => handleDefaultSelect(e, item._id)}
                                >
                                  {item._id === defaultImageId ? "✓ Varsayılan" : "Varsayılan Yap"}
                                </button>
                              )}
                              <img
                                src={item.path}
                                onClick={() => handleImageSelect(index)}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <li className="image-add-button" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <span>＋</span>
                      </li>
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}