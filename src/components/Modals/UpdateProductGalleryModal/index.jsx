import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { getProductGallery, updateProductGallery } from "../../../api/product/productSlicer"
import { toast } from 'react-toastify';
import ImageGalleryUploader from "../../../components/ImageGalleryUploader";

export default function UpdateProductGalleryModal({ companyid, productid, onRefresh }) {
    const [active, setActive] = useState(false);
    const dispatch = useDispatch()
    const { closeModal, isOpen, modals } = useModal();
    const { updateData, isProductLoading, isProcudtSuccess, isProductError } = useSelector(state => state.product)
    const { isUpdateLoading, isUpdateSuccess, isUpdateError } = useSelector(state => state.product)
    const [galleryTitle, setGalleryTitle] = useState("");
    const [galleryDescription, setGalleryDescription] = useState("");
    const [galleryImages, setGalleryImages] = useState([]); // ImageGalleryUploader'dan gelen

    const [initialImages, setInitialImages] = useState([])
    useEffect(() => {
        if (isOpen("updateProductGallery") && companyid && productid) {
            dispatch(getProductGallery({ companyid, productid }));
        }
    }, [isOpen("updateProductGallery"), companyid, productid]);


    useEffect(() => {
        if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {
            toast.success("Güncelleme Başarılı")
            closeModal("updateProductGallery")
            if (onRefresh) {
                onRefresh()
            }

        }
    }, [isUpdateLoading, isUpdateSuccess, isUpdateError])
    useEffect(() => {
        console.log("updateData", updateData)
        if (updateData) {
            setInitialImages(updateData?.images)
        }
    }, [updateData]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const payload = {
            companyid: "6824aace3bd66ed798e41bbb",
            type: "product",
            gallery: {
                title: galleryTitle,
                description: galleryDescription,
                images: galleryImages.map(({ uploadid, path }) => ({
                    uploadid,
                    path,
                    type: "internal"
                }))
            },
        };
        console.log("Ürün Payload:", payload);
        dispatch(updateProductGallery([companyid, productid, payload]));
    };
    return (
        <Modal
            size='xl'
            show={isOpen("updateProductGallery")}
            onHide={() => closeModal("updateProductGallery")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Ürünü güncelle
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col md={12}>
                            <div className="form-section">
                                <div className="form-content">
                                    <div className="form-container">
                                        <div className="container-fluid">

                                            <div className="form-header">
                                                <h2 className="form-title">Ürün Ekleyin</h2>
                                                <p className="form-description">
                                                    Ürünlerinizi ekleyerek Tinnten de kullanıcıların bulmasını sağlaya bilirsiniz. hemen bir  ürün ekleyin.
                                                </p>
                                            </div>
                                            <Form onSubmit={handleSubmitForm}>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Görseller</Form.Label>
                                                    <Col sm={10}>
                                                        <ImageGalleryUploader
                                                            uploaderId="update-product"
                                                            companyid={companyid}
                                                            initialImages={initialImages}
                                                            isEditMode={false}
                                                            onAllImagesUploaded={(uploaderId, gallery) => {
                                                                if (uploaderId === "update-product") {
                                                                    setGalleryImages(gallery);
                                                                }
                                                            }}
                                                            onDeleteImages={(imageId) => {
                                                                // Handle image deletion
                                                                //dispatch(removeImages({ companyid, productid, imageid }))
                                                            }}
                                                            onOrderChange={(uploaderId, newGallery) => {
                                                                // Handle new image order
                                                            }}
                                                            onDefaultImageSelect={(imageId) => {
                                                                // Handle default image selection
                                                            }}
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Col sm={{ span: 10, offset: 2 }}>
                                                        <Button type="submit">Güncelle</Button>
                                                    </Col>
                                                </Form.Group>

                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}
