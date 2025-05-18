import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import { addProduct, updateProduct, getProductBase } from "../../../api/product/productSlicer"
import { toast } from 'react-toastify';

export default function UpdateProduct({ companyid, productid, onRefresh }) {
    const [active, setActive] = useState(false);
    const { closeModal, isOpen, modals } = useModal();
    const dispatch = useDispatch()
    const [title, setTitle] = useState("");
    const [meta, setMeta] = useState("");
    const [description, setDescription] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [categories, setCategories] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState("");
    const [slug, setSlug] = useState("");
    const [attributes, setAttributes] = useState([{ name: "", value: "" }]);



    const { updateData, isProductLoading, isProcudtSuccess, isProductError } = useSelector(state => state.product)
    const { isUpdateLoading, isUpdateSuccess, isUpdateError } = useSelector(state => state.product)

    useEffect(() => {
        if (isOpen("updateProduct") && companyid && productid) {
            dispatch(getProductBase({ companyid, productid }));
        }
    }, [isOpen("updateProduct"), companyid, productid]);

    useEffect(() => {
        if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {
            toast.success("Güncelleme Başarılı")
            closeModal("updateProduct")
            if(onRefresh){
                onRefresh()
            }
          
        }
    }, [isUpdateLoading, isUpdateSuccess, isUpdateError])


    useEffect(() => {
        if (updateData) {
            setTitle(updateData.title || "");
            setMeta(updateData.meta || "");
            setDescription(updateData.description || "");
            setCategories(updateData.categories || []);
            setRedirectUrl(
                Array.isArray(updateData.redirectUrl)
                    ? updateData.redirectUrl[0] || ""
                    : updateData.redirectUrl || ""
            );

            // 🔐 Null kontrolü + dizi kontrolü
            if (Array.isArray(updateData.attributes)) {
                setAttributes(updateData.attributes);
            } else {
                setAttributes([{ name: "", value: "" }]);
            }
        }
    }, [updateData]);
    const handleCategoryKeyDown = (e) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const val = categoryInput.trim().replace(",", "");
            if (val && !categories.includes(val)) {
                setCategories([...categories, val]);
                setCategoryInput("");
            }
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const payload = {
            companyid,
            productid,
            title,
            meta,
            description,
            categories,
            redirectUrl: redirectUrl && redirectUrl.trim() !== "" ? [redirectUrl.trim()] : [],
            attributes,
            type: "product",
        };

        console.log("Güncellenen Ürün Payload:", payload);
        dispatch(updateProduct({ companyid, productid, payload })); // backend fonksiyonuna göre ayarlanacak
    };

    const updateAttribute = (index, field, val) => {
        setAttributes(prev => {
            const newAttrs = [...prev];
            const current = newAttrs[index] || { name: "", value: "" }; // 🛡️ null güvenliği
            newAttrs[index] = { ...current, [field]: val };
            return newAttrs;
        });
    };

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", value: "" }]);
    };

    const removeAttribute = (index) => {
        const filtered = attributes.filter((_, i) => i !== index);
        setAttributes(filtered);
    };
    useEffect(() => {
        const generated = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
        setSlug(generated);
    }, [title]);

    return (
        <Modal
            size='xl'
            show={isOpen("updateProduct")}
            onHide={() => {
                closeModal("updateProduct")
            }}
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
                                                <h2 className="form-title">Ürünü Güncelleyin</h2>
                                                <p className="form-description">
                                                    Bu alan ürünün genel alanlarını güncellemenizi sağlar
                                                </p>
                                            </div>
                                            <Form onSubmit={handleSubmitForm}>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Ürün Adı</Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control
                                                            value={title}
                                                            onChange={(e) => setTitle(e.target.value)}
                                                            required
                                                            placeholder="Ürün adı girin"
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Benzersiz Ürün Kodu</Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control
                                                            readOnly
                                                            value={slug}
                                                            placeholder="Otomatik oluşturulacak"
                                                        />
                                                        <Form.Text className="text-white">
                                                            Bu alan ürün adı temel alınarak oluşturulur ve sistemde benzersiz tanımlama sağlar.
                                                        </Form.Text>
                                                    </Col>
                                                </Form.Group>


                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Meta Açıklama</Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control
                                                            value={meta}
                                                            onChange={(e) => setMeta(e.target.value)}
                                                            placeholder="Kısa açıklama - SEO amaçlı"
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Açıklama</Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={4}
                                                            value={description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            placeholder="Ürünün detaylı açıklaması"
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Kategoriler</Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control
                                                            value={categoryInput}
                                                            onChange={(e) => setCategoryInput(e.target.value)}
                                                            onKeyDown={handleCategoryKeyDown}
                                                            placeholder="Her kategori için virgül veya Enter kullanın"
                                                        />
                                                        <div className="d-flex flex-wrap mt-2">
                                                            {categories.map((tag, index) => (
                                                                <span key={index} className="badge bg-secondary me-2">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Yönlendirme Linki</Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control
                                                            type="url"
                                                            value={redirectUrl}
                                                            onChange={(e) => setRedirectUrl(e.target.value)}
                                                            placeholder="Kullanıcının yönlendirileceği URL"
                                                        />
                                                    </Col>
                                                </Form.Group>



                                                <Row className="mb-3">
                                                    <Col sm={2}>  </Col>
                                                    <Col sm={10} className="d-flex gap-3">
                                                        <Button variant="outline-primary" onClick={addAttribute} className="mt-2">
                                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> Özellik Ekle
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Özellikler</Form.Label>
                                                    <Col sm={10}>
                                                        {attributes.map((attr, index) => (
                                                            <Row key={index} className="mb-2 align-items-center">
                                                                <Col sm={5}>
                                                                    <Form.Control
                                                                        placeholder="Özellik adı (örn. Renk)"
                                                                        value={attr.name}
                                                                        onChange={(e) => updateAttribute(index, "name", e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col sm={5}>
                                                                    <Form.Control
                                                                        placeholder="Değer (örn. Kırmızı)"
                                                                        value={attr.value}
                                                                        onChange={(e) => updateAttribute(index, "value", e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col sm={2}>
                                                                    <Button variant="danger" onClick={() => removeAttribute(index)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        ))}

                                                        <Form.Text className="text-white">Ürününüz için ek özellikler tanımlayabilirsiniz.</Form.Text>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Col sm={{ span: 10, offset: 2 }}>
                                                        <Button disabled={isUpdateLoading} type="submit">Güncelle</Button>
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
