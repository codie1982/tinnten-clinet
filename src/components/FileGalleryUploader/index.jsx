import { useState, useEffect, useCallback,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Carousel, Row, Col, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadMultipleFile, resetUpload } from "../../api/upload/uploadSlicer"; // Adjust import path as needed

export default function FileGalleryUploader({
  uploaderId,
  onAllFilesUploaded,
  initialFiles,
  companyid,
  onDeleteFiles,
  isEditable = true,
  maxFiles = 10,
  acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "text/plain": [".txt"],
  },
}) {
  const galleryRef = useRef(initialFiles || []);
  const dispatch = useDispatch();
  const [gallery, setGallery] = useState(initialFiles || []);
  const [hasProcessedUpload, setHasProcessedUpload] = useState(false);

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
    const initial = initialFiles || [];
    setGallery(initial);
    galleryRef.current = initial;
  }, [initialFiles]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      dispatch(resetUpload(uploaderId));
    };
  }, [uploaderId, dispatch]);

  useEffect(() => {
    if (!isLoading && isSuccess && Array.isArray(files) && files.length > 0 && !hasProcessedUpload) {
      const existingIds = new Set(galleryRef.current.map((file) => file._id || file.path));
      const newUniqueFiles = files.filter(
        (file) => !existingIds.has(file._id || file.path)
      );
  
      const updatedGallery = [...galleryRef.current, ...newUniqueFiles].slice(0, maxFiles);
      setHasProcessedUpload(true); // her koşulda ayarla
  
      if (newUniqueFiles.length > 0) {
        setGallery(updatedGallery);
        galleryRef.current = updatedGallery; // ref'i senkronla
  
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
  
      dispatch(resetUpload(uploaderId));
    }
  
    if (!isLoading && isError && !hasProcessedUpload) {
      toast.error(`Yükleme sırasında hata oluştu: ${error || "Bilinmeyen hata"}`);
      setHasProcessedUpload(true);
      dispatch(resetUpload(uploaderId));
    }
  }, [
    files,
    isError,
    isSuccess,
    isLoading,
    uploaderId,
    error,
    maxFiles,
    dispatch,
    onAllFilesUploaded,
    hasProcessedUpload,
    successCount,
    failureCount,
    totalFiles
  ]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setHasProcessedUpload(false);

      const remainingSlots = maxFiles - galleryRef.current.length;
      if (remainingSlots <= 0) {
        toast.error(`Maksimum dosya sayısına (${maxFiles}) ulaşıldı.`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);
      if (filesToUpload.length < acceptedFiles.length) {
        toast.warn(
          `Yalnızca ${filesToUpload.length} dosya yüklenebilir. Maksimum limit: ${maxFiles}.`
        );
      }

      const formData = new FormData();
      formData.append("companyid", companyid);
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      dispatch(uploadMultipleFile({ uploaderId, files: formData }));
    },
    [companyid, uploaderId, gallery.length, maxFiles, dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFileTypes,
    multiple: true,
    onDrop,
    disabled: !isEditable || gallery.length >= maxFiles,
  });

  const handleDelete = (e, index) => {
    e.stopPropagation();
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
    galleryRef.current = newGallery;
    if (onAllFilesUploaded) {
      onAllFilesUploaded(uploaderId, newGallery);
    }

    if (onDeleteFiles) {
      onDeleteFiles(gallery[index]._id);
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
      {isLoading && (
        <div className="upload-loader-wrapper text-center my-3">
          <Spinner animation="border" role="status" variant="primary" />
          <div>Yükleme devam ediyor...</div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`upload-drag-area ${isDragActive ? "active" : ""} ${!isEditable || gallery.length >= maxFiles ? "disabled" : ""
          }`}
      >
        <input {...getInputProps()} />
        {galleryRef.current.length === 0 ? (
          <div className="file-add-button">
            <span>+</span>
          </div>
        ) : (
          <Row className="file-grid">
            {galleryRef.current.map((item, index) => (
              <Col
                key={item.path}
                xs={6}
                sm={4}
                md={3}
                className="file-grid-item"
              >
                <div className="file-item-wrapper">
                  <div className="file-item">
                    {getFileIcon(item.path)}
                    <span className="file-name">
                      {item.path.split("/").pop()}
                    </span>
                  </div>
                  {isEditable && (
                    <div className="file-actions">
                      <button
                        className="delete-file-button"
                        onClick={(e) => handleDelete(e, index)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </Col>
            ))}
            {isEditable && galleryRef.current.length < maxFiles && (
              <Col xs={6} sm={4} md={3} className="file-grid-item">
                <div className="file-add-button">
                  <span>+</span>
                </div>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}