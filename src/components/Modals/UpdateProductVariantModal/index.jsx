import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { getProductVariants, updateProductVariants } from "../../../api/product/productSlicer"
import { toast } from 'react-toastify';
import ImageGalleryUploader from "../../../components/ImageGalleryUploader";


export default function UpdateProductVariantModal({ companyid, productid, onRefresh }) {
    const [active, setActive] = useState(false);
    const dispatch = useDispatch()
    const { closeModal, isOpen, modals } = useModal();
    const { updateData, isProductLoading, isProcudtSuccess, isProductError } = useSelector(state => state.product)
    const { isUpdateLoading, isUpdateSuccess, isUpdateError, operation } = useSelector(state => state.product)
    const [variants, setVariants] = useState([]);
    const [variantIndex, setVariantIndex] = useState(0); // aktif varyant index
    const current = variants[variantIndex] || {
        sku: "",
        stock: 0,
        price: { originalPrice: 0, discountRate: 0, currency: "TL" },
        attributes: [],
        images: [],
    };
    useEffect(() => {
        if (isOpen("updateProductVariant") && companyid && productid) {
            dispatch(getProductVariants({ companyid, productid }));
        }
    }, [isOpen("updateProductVariant"), companyid, productid]);


    useEffect(() => {
        if (operation == "getVariants")
            if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {
                toast.success("Güncelleme Başarılı")
                closeModal("updateProductVariant")
                if (onRefresh) {
                    onRefresh()
                }

            }
    }, [isUpdateLoading, isUpdateSuccess, isUpdateError, operation])
    useEffect(() => {
        if (Array.isArray(updateData) && updateData.length > 0) {
            const enrichedVariants = updateData.map((variant) => ({
                ...variant,
                price: variant.price && typeof variant.price === "object" ? variant.price : {
                    originalPrice: 0,
                    discountRate: 0,
                    currency: "TL",
                },
                attributes: Array.isArray(variant.attributes) ? variant.attributes : [{ name: "", value: "" }],
                images: Array.isArray(variant.images)
                    ? variant.images.map(img => ({
                        uploadid: img.uploadid || img._id || "",
                        path: img.path || img.url || "",
                        type: "internal",
                    }))
                    : [],
            }));

            setVariants(enrichedVariants);
            setVariantIndex(0); // ilk varyant gösterilsin
        }
    }, [updateData]);

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const payload = {
            variants
        };
        console.log("payload", payload)
        dispatch(updateProductVariants([companyid, productid, { variants: cleanedVariants }]));
    };
    const cleanedVariants = variants.map(v => {
        const { _id, ...rest } = v;
        return rest;
    });
    return (
        <Modal
            size="xl"
            show={isOpen("updateProductVariant")}
            onHide={() => closeModal("updateProductVariant")}
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
                        <Col md={7}>
                            <div className="form-section">
                                <div className="form-content">
                                    <div className="form-container">
                                        <div className="container-fluid">

                                            <div className="form-header">
                                                <h2 className="form-title">Ürün Varyantlarını Güncelleyin</h2>
                                                <p className="form-description">
                                                    Ürünlerinizi ekleyerek Tinnten de kullanıcıların bulmasını sağlaya bilirsiniz. hemen bir  ürün ekleyin.
                                                </p>
                                            </div>
                                            <Form onSubmit={handleSubmitForm}>
                                                <>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Varyantlar</Form.Label>
                                                        <Form.Text className="text-muted d-block mb-3">
                                                            Varyantlar, ürününüzün farklı seçeneklerini temsil eder (örneğin renk, boyut, depolama). Her varyant için ayrı stok ve fiyat belirleyebilirsiniz.
                                                        </Form.Text>

                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <div>
                                                                <strong>Varyant:</strong> {variantIndex + 1} / {variants.length}
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    onClick={() => setVariantIndex((i) => Math.max(i - 1, 0))}
                                                                    disabled={variantIndex === 0}
                                                                >
                                                                    ◀️ Geri
                                                                </Button>
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    onClick={() => setVariantIndex((i) => Math.min(i + 1, variants.length - 1))}
                                                                    disabled={variantIndex === variants.length - 1}
                                                                >
                                                                    İleri ▶️
                                                                </Button>
                                                                <Button
                                                                    variant="outline-success"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const newVariant = {
                                                                            sku: "",
                                                                            stock: 0,
                                                                            price: { originalPrice: parseFloat(current.price?.originalPrice || 0), discountRate: 0, currency: "TL" },
                                                                            attributes: [{ name: "", value: "" }],
                                                                            images: [],
                                                                        };
                                                                        setVariants((prev) => {
                                                                            const updated = [...prev, newVariant];
                                                                            setVariantIndex(updated.length - 1);
                                                                            return updated;
                                                                        });
                                                                    }}
                                                                >
                                                                    ➕ Varyant Ekle
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* === SADECE AKTİF VARYANT === */}
                                                        {variants.length > 0 && (
                                                            <div className="border p-3 mb-4 rounded position-relative variant-bg">
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const updated = variants.filter((_, idx) => idx !== variantIndex);
                                                                        const newIndex = Math.max(0, variantIndex - 1);
                                                                        setVariants(updated);
                                                                        setVariantIndex(newIndex);
                                                                    }}
                                                                    className="position-absolute top-0 end-0 m-2"
                                                                >
                                                                    Varyantı Sil
                                                                </Button>

                                                                {/* Varyant Referansı */}
                                                                {(() => {
                                                                    const current = variants[variantIndex];

                                                                    return (
                                                                        <>
                                                                            {/* 📈 Fiyat */}
                                                                            <Form.Group as={Row} className="mb-3">
                                                                                <Form.Label column sm={2}>Varyant Fiyatı</Form.Label>
                                                                                <Col sm={7}>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        value={current.price?.originalPrice || ""}
                                                                                        onChange={(e) => {
                                                                                            const updated = [...variants];
                                                                                            updated[variantIndex] = {
                                                                                                ...updated[variantIndex],
                                                                                                price: {
                                                                                                    ...updated[variantIndex].price,
                                                                                                    originalPrice: e.target.value.replace(/[^\d.]/g, "")
                                                                                                }
                                                                                            };
                                                                                            setVariants(updated);
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                                <Col sm={3}>
                                                                                    <Form.Select
                                                                                        value={current.price?.currency || "TL"}
                                                                                        onChange={(e) => {
                                                                                            const updated = [...variants];
                                                                                            updated[variantIndex] = {
                                                                                                ...updated[variantIndex],
                                                                                                price: {
                                                                                                    ...updated[variantIndex].price,
                                                                                                    currency: e.target.value
                                                                                                }
                                                                                            };
                                                                                            setVariants(updated);
                                                                                        }}
                                                                                    >
                                                                                        <option value="TL">TL</option>
                                                                                        <option value="DL">DL</option>
                                                                                    </Form.Select>
                                                                                </Col>
                                                                            </Form.Group>

                                                                            {/* 📸 Görseller */}
                                                                            <Row className="mb-3">
                                                                                <Col>
                                                                                    <strong>Varyant Görselleri</strong>
                                                                                    <ImageGalleryUploader
                                                                                        key={variantIndex}
                                                                                        uploaderId={`variant-${variantIndex}`}
                                                                                        initialImages={current.images || []}
                                                                                        companyid={companyid}
                                                                                        onAllImagesUploaded={(id, images) => {
                                                                                            if (id === `variant-${variantIndex}`) {
                                                                                                const updated = [...variants];
                                                                                                updated[variantIndex].images = images.map(img => ({
                                                                                                    uploadid: img.uploadid,
                                                                                                    type: "internal",
                                                                                                    path: img.url || img.path
                                                                                                }));
                                                                                                setVariants(updated);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            </Row>

                                                                            {/* 🧬 Özellikler */}
                                                                            <Row>
                                                                                <Col>
                                                                                    <strong>Varyant Özellikleri</strong>
                                                                                    {(current.attributes || []).map((attr, aIdx) => (
                                                                                        <Row key={aIdx} className="mt-2 align-items-center">
                                                                                            <Col sm={5}>
                                                                                                <Form.Control
                                                                                                    placeholder="Özellik adı"
                                                                                                    value={attr.name}
                                                                                                    onChange={(e) => {
                                                                                                        const updated = [...variants];
                                                                                                        const updatedAttributes = [...updated[variantIndex].attributes];
                                                                                                        updatedAttributes[aIdx] = {
                                                                                                            ...updatedAttributes[aIdx],
                                                                                                            name: e.target.value
                                                                                                        };
                                                                                                        updated[variantIndex] = {
                                                                                                            ...updated[variantIndex],
                                                                                                            attributes: updatedAttributes
                                                                                                        };
                                                                                                        setVariants(updated);
                                                                                                    }}
                                                                                                />
                                                                                            </Col>
                                                                                            <Col sm={5}>
                                                                                                <Form.Control
                                                                                                    placeholder="Değer"
                                                                                                    value={attr.value}
                                                                                                    onChange={(e) => {
                                                                                                        const updated = [...variants];
                                                                                                        updated[variantIndex].attributes[aIdx].value = e.target.value;
                                                                                                        setVariants(updated);
                                                                                                    }}
                                                                                                />
                                                                                            </Col>
                                                                                            <Col sm={2}>
                                                                                                <Button
                                                                                                    variant="outline-danger"
                                                                                                    size="sm"
                                                                                                    onClick={() => {
                                                                                                        const updated = [...variants];
                                                                                                        const updatedAttributes = updated[variantIndex].attributes.filter((_, i) => i !== aIdx);
                                                                                                        updated[variantIndex] = {
                                                                                                            ...updated[variantIndex],
                                                                                                            attributes: updatedAttributes
                                                                                                        };
                                                                                                        setVariants(updated);
                                                                                                    }}
                                                                                                >
                                                                                                    ❌
                                                                                                </Button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    ))}
                                                                                    <Button
                                                                                        variant="outline-light"
                                                                                        size="sm"
                                                                                        className="mt-3"
                                                                                        onClick={() => {
                                                                                            const updated = [...variants];
                                                                                            updated[variantIndex] = {
                                                                                                ...updated[variantIndex],
                                                                                                attributes: [...(updated[variantIndex].attributes || []), { name: "", value: "" }]
                                                                                            };
                                                                                            setVariants(updated);
                                                                                        }}
                                                                                    >
                                                                                        + Özellik Ekle
                                                                                    </Button>
                                                                                </Col>
                                                                            </Row>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Col sm={{ span: 10, offset: 2 }}>
                                                            <Button type="submit">Güncelle</Button>
                                                        </Col>
                                                    </Form.Group>
                                                </>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal >
    )
}
