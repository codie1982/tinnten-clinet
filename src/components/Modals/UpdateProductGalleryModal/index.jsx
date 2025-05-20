import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { getProductGallery, updateProductGallery, deleteImageFromGallery } from "../../../api/product/productSlicer"
import { toast } from 'react-toastify';
import ImageGalleryUploader from "../../../components/ImageGalleryUploader";

export default function UpdateProductGalleryModal({ companyid, productid, onRefresh }) {
  const dispatch = useDispatch();
  const { closeModal, isOpen } = useModal();

  const { updateData, isUpdateLoading, isUpdateSuccess, isUpdateError, operation ,deleteImage} = useSelector(
    (state) => {
      return state.product
    }
  );

  const [galleryTitle, setGalleryTitle] = useState("Ürün Galerisi");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState([]); // yeni yüklenen görseller
  const [initialImages, setInitialImages] = useState([]); // backend'den gelen görseller

  useEffect(() => {
    if (isOpen("updateProductGallery") && companyid && productid) {
      dispatch(getProductGallery({ companyid, productid }));
    }
  }, [isOpen("updateProductGallery"), companyid, productid]);

  useEffect(() => {
    if (operation == "deleteImageFromGallery") {
      if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {

        setInitialImages((prev) => prev.filter((img) => img.uploadid !== "imageId" && img._id !== "imageId"));
        toast.info("Sunucudan görsel silindi.");
      }
    }
  }, [isUpdateLoading, isUpdateSuccess, isUpdateError, operation,deleteImage])
  
  useEffect(() => {
    if (operation == "deleteImageFromGallery") {
      if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {
        const _imageid = deleteImage.imageid
        setInitialImages((prev) => prev.filter((img) => img.uploadid !== _imageid && img._id !== _imageid));
        toast.info("Sunucudan görsel silindi.");
      }
    } else {
      if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {
        toast.success("Güncelleme Başarılı");
        closeModal("updateProductGallery");
        console.log("onRefresh",onRefresh)
        onRefresh?.();
      }
    }

  }, [isUpdateLoading, isUpdateSuccess, isUpdateError, operation,deleteImage]);

  useEffect(() => {
    if (updateData) {
      setInitialImages(updateData?.images || []);
      setGalleryTitle(updateData?.title || "Ürün Galerisi");
      setGalleryDescription(updateData?.description || "");
    }
  }, [updateData]);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (galleryImages.length === 0 && initialImages.length === 0) {
      toast.error("Lütfen en az bir görsel ekleyin.");
      return;
    }

    const allImages = [...initialImages, ...galleryImages].map(({ uploadid, path }) => ({
      uploadid,
      path,
      type: "internal"
    }));

    const payload = {
      companyid,
      type: "product",
      gallery: {
        title: galleryTitle,
        description: galleryDescription,
        images: allImages
      }
    };
    console.log("companyid, productid", companyid, productid)
    if (!companyid || !productid) {
      toast.error("Firma ID'si veya Ürün IDsi okunmuyor.")
      return;
    }
    dispatch(updateProductGallery({ companyid, productid, payload }));
  };

  const handleDeleteImage = (imageId) => {
    const confirmDelete = window.confirm("Bu görseli silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    const isExistingImage = initialImages.some(
      (img) => img.uploadid === imageId || img._id === imageId
    );

    if (isExistingImage) {
      dispatch(deleteImageFromGallery({ companyid, productid, imageid: imageId }));
    } else {
      setGalleryImages((prev) => prev.filter((img) => img.uploadid !== imageId));
      toast.info("Yeni yüklenen görsel kaldırıldı.");
    }
  };

  return (
    <Modal
      size="xl"
      show={isOpen("updateProductGallery")}
      onHide={() => closeModal("updateProductGallery")}
      aria-labelledby="example-modal-sizes-title-lg plans-container"
    >
      <Modal.Header className="feature-plan-container" closeButton>
        <Modal.Title className="feature-plan-title">Ürün Görsellerini Güncelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Form onSubmit={handleSubmitForm}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Görseller</Form.Label>
              <Col sm={10}>
                <ImageGalleryUploader
                  uploaderId="update-product"
                  companyid={companyid}
                  initialImages={[...initialImages, ...galleryImages]}
                  isEditMode={false}
                  onAllImagesUploaded={(uploaderId, gallery) => {
                    if (uploaderId === "update-product") {
                      console.log("gallery", gallery)
                      setGalleryImages(gallery);
                    }
                  }}
                  onDeleteImages={handleDeleteImage}
                  onOrderChange={(uploaderId, newGallery) => {
                    if (uploaderId === "update-product") {
                      setGalleryImages(newGallery);
                    }
                  }}
                  onDefaultImageSelect={(imageId) => {
                    // opsiyonel
                  }}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Başlık</Form.Label>
              <Col sm={10}>
                <Form.Control
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="Galeri başlığı"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Açıklama</Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  placeholder="Galeri açıklaması"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit" disabled={isUpdateLoading}>
                  Galeriyi Güncelle
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
