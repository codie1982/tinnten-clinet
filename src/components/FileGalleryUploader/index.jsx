import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Carousel, Row, Col, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadMultipleImage, resetUpload } from "../../api/upload/uploadSlicer"; // Adjust import path as needed

export default function FileGalleryUploader({
  uploaderId,
  onAllFilesUploaded,
  initialFiles,
  companyid,
  onDeleteFiles,
  onOrderChange,
  onDefaultFileSelect,
  isEditable = true, // Default to true for backward compatibility
}) {
  const dispatch = useDispatch();
  const [gallery, setGallery] = useState(initialFiles || []);
  const [fileIndex, setFileIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [defaultFileId, setDefaultFileId] = useState(null);

  const uploadState = useSelector((state) => state.upload?.[uploaderId] || {});

  const {
    isLoading,
    isSuccess,
    isError,
    files,
    successCount,
    failureCount,
    totalFiles,
    error,
  } = uploadState;

  useEffect(() => {
    setGallery(initialFiles || []);
    // Set initial default file if provided
    if (initialFiles?.length > 0 && initialFiles[0]?._id) {
      setDefaultFileId(
        initialFiles.find((file) => file.isDefault)?._id || initialFiles[0]._id
      );
    }
  }, [initialFiles]);

  useEffect(() => {
    // Reset upload state on component mount
    const resetUpload = () => {
      dispatch({ type: "upload/reset", payload: { uploaderId } });
    };
    resetUpload();
  }, [dispatch, uploaderId]);

  useEffect(() => {
    if (!isLoading && isSuccess && Array.isArray(files)) {
      const existingIds = new Set(gallery.map((file) => file._id || file.path));
      const newUniqueFiles = files.filter(
        (file) => !existingIds.has(file._id || file.path)
      );
      const updatedGallery = [...gallery, ...newUniqueFiles];
      setGallery(updatedGallery);

      const success = successCount ?? files.length;
      const fail = failureCount ?? 0;
      const total = totalFiles ?? success + fail;

      if (fail === total) {
        toast.error(`${fail} dosya başarısız yüklendi.`);
      } else if (success === total) {
        toast.success(`${success} başarılı olmak üzere toplam ${total} dosya yüklendi.`);
      } else {
        toast.info(`${success} başarılı, ${fail} başarısız dosya yüklendi.`);
      }

      if (onAllFilesUploaded) {
        onAllFilesUploaded(uploaderId, updatedGallery);
      }
    }

    if (!isLoading && isError) {
      toast.error(`Yükleme sırasında hata oluştu: ${error || "Bilinmeyen hata"}`);
    }
  }, [files, isError, isSuccess, isLoading, onAllFilesUploaded, uploaderId, error]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const formData = new FormData();
      formData.append("companyid", companyid);

      acceptedFiles.forEach((file) => {
        formData.append("files", file);
      });

      dispatch(uploadMultipleFile({ uploaderId, files: formData }));
    },
    [dispatch, companyid, uploaderId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: true,
    onDrop,
    disabled: !isEditable, // Disable dropzone if not editable
  });

  const handleFileSelect = (index) => {
    setFileIndex(index);
  };

  const handleDelete = (e, index, file) => {
    e.stopPropagation();
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);

    if (onAllFilesUploaded) {
      onAllFilesUploaded(uploaderId, newGallery);
    }

    if (onDeleteFiles) {
      onDeleteFiles(file._id);
    }

    if (file._id === defaultFileId) {
      const newDefault = newGallery[0]?._id || null;
      setDefaultFileId(newDefault);
      if (onDefaultFileSelect) {
        onDefaultFileSelect(newDefault);
      }
    }

    if (index === fileIndex) {
      setFileIndex(0);
    } else if (index < fileIndex) {
      setFileIndex(fileIndex - 1);
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

  const handleDefaultSelect = (e, fileId) => {
    e.stopPropagation();
    setDefaultFileId(fileId);
    if (onDefaultFileSelect) {
      onDefaultFileSelect(fileId);
    }
  };

  const getFileIcon = (filePath) => {
    const extension = filePath.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <i className="fas fa-file-pdf" />;
      case "doc":
      case "docx":
        return <i className="fas fa-file-word" />;
      case "txt":
        return <i className="fas fa-file-alt" />;
      default:
        return <i className="fas fa-file" />;
    }
  };

  return (
    <div className="file-gallery-uploader">
      {isEditable && (
        <div className="edit-mode-toggle mb-3">
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Düzenlemeyi Bitir" : "Düzenleme Modu"}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="upload-loader-wrapper text-center my-3">
          <Spinner animation="border" role="status" variant="primary" />
          <div>Yükleme devam ediyor...</div>
        </div>
      )}

      {gallery.length === 0 && isEditable && (
        <div {...getRootProps()} className={`upload-drag-area ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <p>Dosyaları buraya sürükleyin ya da tıklayarak seçin</p>
        </div>
      )}

      {gallery.length > 0 && (
        <>
          <Row>
            <Col className="file-section">
              <div className="file-gallery-carousel-wrapper">
                <Carousel
                  activeIndex={fileIndex}
                  onSelect={handleFileSelect}
                  indicators={false}
                  controls={true}
                  fade={true}
                  className="file-carousel"
                >
                  {gallery.map((item, index) => (
                    <Carousel.Item key={item.path} className="carousel-item-wrapper">
                      <div className="carousel-file-container">
                        <div className="file-preview">
                          {getFileIcon(item.path)}
                          <span className="file-name">{item.path.split("/").pop()}</span>
                        </div>
                        {item._id === defaultFileId && (
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
              <DragDropContext onDragEnd={isEditable ? handleDragEnd : () => {}}>
                <Droppable droppableId="gallery" direction="horizontal">
                  {(provided) => (
                    <ul
                      className="file-detail-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {gallery.map((item, index) => (
                        <Draggable
                          key={item.path}
                          draggableId={item.path}
                          index={index}
                          isDragDisabled={!isEditable || !isEditMode}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={index === fileIndex ? "active" : ""}
                            >
                              {isEditable && isEditMode && (
                                <>
                                  <button
                                    className="delete-file-button"
                                    onClick={(e) => handleDelete(e, index, item)}
                                  >
                                    ×
                                  </button>
                                  <button
                                    className={`default-select-button ${item._id === defaultFileId ? "selected" : ""}`}
                                    onClick={(e) => handleDefaultSelect(e, item._id)}
                                  >
                                    {item._id === defaultFileId ? "✓ Varsayılan" : "Varsayılan Yap"}
                                  </button>
                                </>
                              )}
                              <div
                                className="file-item"
                                onClick={() => handleFileSelect(index)}
                              >
                                {getFileIcon(item.path)}
                                <span>{item.path.split("/").pop()}</span>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {isEditable && (
                        <li className="file-add-button" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <span>＋</span>
                        </li>
                      )}
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