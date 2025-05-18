import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { addProduct, updateProduct, getProductPrice,updateProductPrice } from "../../../api/product/productSlicer"
import { toast } from 'react-toastify';
export default function UpdateProductPriceModal({ companyid, productid, onRefresh }) {
    const [active, setActive] = useState(false);
    const dispatch = useDispatch()
    const { closeModal, isOpen, modals } = useModal();
    const [priceType, setPriceType] = useState("fixed"); // "fixed" or "offer"
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [currency, setCurrency] = useState("TL");
    const [rentalType, setRentalType] = useState("continuous"); // veya "periodic"
    const [isOfferable, setIsOfferable] = useState(false);
    const [requestRequired, setRequestRequired] = useState(false);
    const [periodType, setPeriodType] = useState("daily"); // daily, weekly, monthly, customRange
    const [multiplierType, setMultiplierType] = useState("percentage");
    const [multiplierValue, setMultiplierValue] = useState(0);
    const [pricingModifiers, setPricingModifiers] = useState([
        { label: "", type: "increase", value: 0 }
    ]);
    const [rentalCurrency, setRentalCurrency] = useState("TL");
    const [rentalBasePrice, setRentalBasePrice] = useState(0)

    const [priceHistory, setPriceHistory] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // [0] = en yeni
    const [isLatest, setIsLatest] = useState(true);



    const handleSubmitForm = (e) => {
        e.preventDefault();
      
        if (!isLatest) {
          toast.warning("Sadece en güncel fiyat düzenlenebilir.");
          return;
        }
      
        const payload = {
          originalPrice: Number(originalPrice),
          discountRate: Number(discountRate),
          currency,
          isOfferable,
          requestRequired
        };
      
        dispatch(updateProductPrice({ companyid, productid, payload }));
      };


    const { updateData, isProductLoading, isProcudtSuccess, isProductError } = useSelector(state => state.product)
    const { isUpdateLoading, isUpdateSuccess, isUpdateError } = useSelector(state => state.product)

    useEffect(() => {
        if (isOpen("updateProductPrice") && companyid && productid) {
            dispatch(getProductPrice({ companyid, productid }));
        }
    }, [isOpen("updateProductPrice"), companyid, productid]);


    useEffect(() => {
        if (!isUpdateLoading && isUpdateSuccess && !isUpdateError) {
            toast.success("Güncelleme Başarılı")
            closeModal("updateProductPrice")
            if (onRefresh) {
                onRefresh()
            }

        }
    }, [isUpdateLoading, isUpdateSuccess, isUpdateError])

    useEffect(() => {
        if (Array.isArray(updateData) && updateData.length > 0) {
          const sorted = [...updateData].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPriceHistory(sorted);
          setActiveIndex(0);
        }
      }, [updateData]);
      useEffect(() => {
        if (priceHistory.length > 0 && activeIndex >= 0) {
          const price = priceHistory[activeIndex];
      
          setOriginalPrice(price.originalPrice?.toString() || "");
          setDiscountRate(price.discountRate?.toString() || "");
          setCurrency(price.currency || "TL");
          setIsOfferable(price.isOfferable || false);
          setRequestRequired(price.requestRequired || false);
      
          setIsLatest(activeIndex === 0); // Sadece en yeni veri düzenlenebilir
        }
      }, [priceHistory, activeIndex]);
    return (
        <Modal
            size='xl'
            show={isOpen("updateProductPrice")}
            onHide={() => closeModal("updateProductPrice")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    Ürünün Fiyatını güncelle
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
                                                <h2 className="form-title">Ürünün Fiyatını güncelle</h2>
                                                <p className="form-description">
                                                    ürün fiyatları güncellenmez. yeni bir fiyat bilgisi olarak eklenir.
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <strong>Fiyat Tarihi:</strong>{" "}
                                                        {priceHistory[activeIndex]?.createdAt
                                                            ? new Date(priceHistory[activeIndex].createdAt).toLocaleString("tr-TR")
                                                            : "—"}
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                                                            disabled={activeIndex === priceHistory.length - 1}
                                                        >
                                                            ◀️ Geri
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => setActiveIndex((i) => Math.min(i + 1, priceHistory.length - 1))}
                                                            disabled={activeIndex === 0}
                                                        >
                                                            İleri ▶️
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Form onSubmit={handleSubmitForm}>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm={2}>Fiyat Türü</Form.Label>
                                                    <Col sm={10} className="d-flex gap-3">
                                                        <Form.Check
                                                            type="radio"
                                                            label="Sabit Fiyat"
                                                            name="priceType"
                                                            value="fixed"
                                                            checked={priceType === "fixed"}
                                                            disabled={!isLatest}
                                                            onChange={() => setPriceType("fixed")}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Teklif Alınabilir"
                                                            name="priceType"
                                                            value="offer"
                                                            checked={priceType === "offer"}
                                                            disabled={!isLatest}
                                                            onChange={() => setPriceType("offer")}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Kiralana Bilir"
                                                            name="priceType"
                                                            value="rental"
                                                            disabled={true}
                                                            checked={priceType === "rental"}
                                                            onChange={() => setPriceType("rental")}
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                {priceType === "fixed" && (
                                                    <>
                                                        <Form.Group as={Row} className="mb-3">
                                                            <Form.Label column sm={2}>Satış Fiyatı</Form.Label>
                                                            <Col sm={7}>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={originalPrice}
                                                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                                                    onInput={(e) => {
                                                                        e.target.value = e.target.value.replace(/[^\d.]/g, "");
                                                                    }}
                                                                    disabled={!isLatest}
                                                                    placeholder="Ürünün fiyatı"
                                                                />
                                                            </Col>
                                                            <Col sm={3}>
                                                                <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                                                    <option value="TL">TL</option>
                                                                    <option value="DL">DL</option>
                                                                </Form.Select>
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row} className="mb-3">
                                                            <Form.Label column sm={2}>İndirim Oranı (%)</Form.Label>
                                                            <Col sm={10}>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={discountRate}
                                                                    onChange={(e) => setDiscountRate(e.target.value)}
                                                                    disabled={!isLatest}
                                                                    placeholder="Varsa, indirim yüzdesi"
                                                                />
                                                            </Col>
                                                        </Form.Group>
                                                    </>
                                                )}
                                                {priceType === "offer" && (
                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label column sm={2}>Teklif Formu</Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Select disabled>
                                                                <option>Teklif formu listesi (backend entegresi sonra yapılacak)</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>
                                                )}
                                                {priceType === "rental" && (
                                                    <>
                                                        {/* Kiralama Tipi ve Periyot Seçimi zaten var */}

                                                        {/* 1️⃣ Ana Kiralama Fiyatı */}
                                                        <Form.Group as={Row} className="mb-3">
                                                            <Form.Label column sm={2}>Kiralama Tipi</Form.Label>
                                                            <Col sm={10} className="d-flex gap-3">
                                                                <Form.Check
                                                                    type="radio"
                                                                    label="Sürekli Kiralık"
                                                                    name="rentalType"
                                                                    value="continuous"
                                                                    disabled={!isLatest}
                                                                    checked={rentalType === "continuous"}
                                                                    onChange={() => setRentalType("continuous")}
                                                                />
                                                                <Form.Check
                                                                    type="radio"
                                                                    label="Günlük Kiralık"
                                                                    name="rentalType"
                                                                    value="daily"
                                                                    disabled={!isLatest}
                                                                    checked={rentalType === "daily"}
                                                                    onChange={() => setRentalType("daily")}
                                                                />
                                                            </Col>
                                                        </Form.Group>
                                                        <Form.Group as={Row} className="mb-3">
                                                            <Form.Label column sm={2}>Kiralama Fiyatı</Form.Label>
                                                            <Col sm={7}>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={originalPrice}
                                                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                                                    disabled={!isLatest}
                                                                    onInput={(e) => {
                                                                        e.target.value = e.target.value.replace(/[^\d.]/g, "");
                                                                    }}
                                                                    placeholder="Ürünün fiyatı"
                                                                />
                                                            </Col>
                                                            <Col sm={3}>
                                                                <Form.Select value={rentalCurrency} onChange={(e) => setRentalCurrency(e.target.value)}>
                                                                    <option value="TL">₺ TL</option>
                                                                    <option value="DL">$ Dolar</option>
                                                                </Form.Select>
                                                            </Col>
                                                        </Form.Group>

                                                        {/* 2️⃣ Çarpanlı Fiyat Kuralları */}
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Fiyat Seçenek Kuralları</Form.Label>

                                                            {pricingModifiers.map((rule, idx) => (
                                                                <Row className="mb-2" key={idx}>
                                                                    <Col sm={4}>
                                                                        <Form.Control
                                                                            placeholder="Etiket (örn. 2 kişi)"
                                                                            value={rule.label}
                                                                            disabled={!isLatest}
                                                                            onChange={(e) => {
                                                                                const updated = [...pricingModifiers];
                                                                                updated[idx].label = e.target.value;
                                                                                setPricingModifiers(updated);
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col sm={3}>
                                                                        <Form.Select
                                                                            value={rule.type}
                                                                            disabled={!isLatest}
                                                                            onChange={(e) => {
                                                                                const updated = [...pricingModifiers];
                                                                                updated[idx].type = e.target.value;
                                                                                setPricingModifiers(updated);
                                                                            }}
                                                                        >
                                                                            <option value="increase">Artış (+)</option>
                                                                            <option value="decrease">Azalış (-)</option>
                                                                        </Form.Select>
                                                                    </Col>
                                                                    <Col sm={3}>
                                                                        <Form.Control
                                                                            type="text"
                                                                            placeholder="% Değer"
                                                                            value={rule.value}
                                                                            disabled={!isLatest}
                                                                            onChange={(e) => {
                                                                                const updated = [...pricingModifiers];
                                                                                updated[idx].value = e.target.value.replace(/[^\d.]/g, "");
                                                                                setPricingModifiers(updated);
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col sm={2}>
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            size="sm"
                                                                            disabled={!isLatest}
                                                                            onClick={() => {
                                                                                setPricingModifiers(pricingModifiers.filter((_, i) => i !== idx));
                                                                            }}
                                                                        >
                                                                            ❌
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            ))}

                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                disabled={!isLatest}
                                                                onClick={() =>
                                                                    setPricingModifiers([...pricingModifiers, { label: "", type: "increase", value: "" }])
                                                                }
                                                            >
                                                                + Yeni Seçenek
                                                            </Button>
                                                        </Form.Group>
                                                    </>
                                                )}

                                                <Form.Group as={Row} className="mb-3">
                                                    <Col sm={{ span: 10, offset: 2 }}>
                                                        <Button disabled={!isLatest} type="submit">Güncelle</Button>
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
