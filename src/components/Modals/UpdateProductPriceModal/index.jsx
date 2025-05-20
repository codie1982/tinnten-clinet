import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { addProduct, updateProduct, getProductPrice, updateProductPrice, resetOperation, deleteProductBasePriceItem } from "../../../api/product/productSlicer"
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
    const [priceHistory, setPriceHistory] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // [0] = en yeni
    const [isLatest, setIsLatest] = useState(true);
    const [isGetLoading, setIsGetLoading] = useState(false)
    const [isUpdateLoading, setIsUpdateLoading] = useState()

    const [discountedPrice, setDiscountedPrice] = useState("");

    const [originalPriceDisplay, setOriginalPriceDisplay] = useState("");
    const [discountedPriceDisplay, setDiscountedPriceDisplay] = useState("");

    // originalPrice değiştiğinde gösterim alanını güncelle
    useEffect(() => {
        setOriginalPriceDisplay(formatCurrency(originalPrice));
    }, [originalPrice]);

    // discountedPrice değiştiğinde gösterim alanını güncelle
    useEffect(() => {
        setDiscountedPriceDisplay(formatCurrency(discountedPrice));
    }, [discountedPrice]);

    // 🔁 1️⃣ İndirim oranı ve satış fiyatı varsa → indirimli fiyat hesapla
    useEffect(() => {
        const price = parseFloat(originalPrice);
        const rate = parseFloat(discountRate);

        if (!isNaN(price) && !isNaN(rate)) {
            const discounted = price - (price * (rate / 100));
            setDiscountedPrice(discounted.toFixed(2));
        }
    }, [originalPrice, discountRate]);

    // 🔁 2️⃣ İndirimli fiyat ve indirim oranı varsa → satış fiyatı hesapla
    useEffect(() => {
        const discounted = parseFloat(discountedPrice);
        const rate = parseFloat(discountRate);

        // Kullanıcı indirimli fiyat alanına odaklanmışsa ve oran belliyse
        if (
            document.activeElement.name === "discountedPrice" &&
            !isNaN(discounted) &&
            !isNaN(rate) &&
            rate < 100
        ) {
            const calculatedOriginal = discounted / (1 - rate / 100);
            setOriginalPrice(calculatedOriginal.toFixed(2));
        }
    }, [discountedPrice]);




    // 1000.50 → "1.000,50 ₺"
    const formatCurrency = (value) => {
        if (value === "" || isNaN(value)) return "";
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // "1.000,50 ₺" → 1000.50
    const parseCurrency = (str) => {
        const clean = str.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
        return parseFloat(clean) || 0;
    };

    const { updateData, deletePriceItem, isLoading, isSuccess, isError, operation } = useSelector(state => state.product)

    useEffect(() => {
        console.log("isOpen(updateProductPrice)")
        if (isOpen("updateProductPrice") && companyid && productid) {
            dispatch(resetOperation())
            dispatch(getProductPrice({ companyid, productid }));
        }
    }, [isOpen("updateProductPrice"), companyid, productid]);


    useEffect(() => {
        console.log("operation", operation)
        if (operation == "getPrice") {
            setIsGetLoading(isLoading)
            setIsUpdateLoading(isUpdateLoading)
            if (!isLoading && isSuccess && !isError) {
                toast.success("Güncelleme Başarılı")
            }
        } else if (operation == "updatePrice") {
            setIsUpdateLoading(isUpdateLoading)
            if (!isLoading && isSuccess && !isError) {
                toast.success("Güncelleme Başarılı")
                closeModal("updateProductPrice")
                if (onRefresh) {
                    onRefresh()
                }
            }
        }
    }, [isLoading, isSuccess, isError, operation, dispatch])

    useEffect(() => {
        if (Array.isArray(updateData) && updateData.length > 0) {
            const sorted = [...updateData].sort((a, b) => {
                return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0); // 👈 A'dan B'ye
            });
            setPriceHistory(sorted);
            setActiveIndex(sorted.length - 1); // 👈 En yeniyi seç
        }
    }, [updateData]);

    useEffect(() => {
        if (!deletePriceItem || !deletePriceItem._id) return;

        setPriceHistory((prev) => {
            const updated = prev.filter((item) => item._id !== deletePriceItem._id);
            // index güncellemesi gerekiyorsa burada yap
            setActiveIndex(Math.max(updated.length - 1, 0)); // en son elemana dön
            return updated;
        });
        toast.success("Fiyat başarıyla silindi");
    }, [deletePriceItem]);


    useEffect(() => {
        if (priceHistory.length > 0 && activeIndex >= 0) {
            const price = priceHistory[activeIndex];
            setOriginalPrice(price.originalPrice ?? "");
            setDiscountRate(price.discountRate?.toString() ?? "");
            setCurrency(price.currency ?? "TL");
            setIsOfferable(price.isOfferable ?? false);
            setRequestRequired(price.requestRequired ?? false);

            // 🆕 Burası eksikti:
            const calculated = price.originalPrice - (price.originalPrice * (price.discountRate / 100));
            setDiscountedPrice(calculated.toFixed(2));

            setIsLatest(activeIndex === 0);
        }
    }, [priceHistory, activeIndex]);
    const handleSubmitForm = (e) => {
        e.preventDefault();

        let payload = {};
        payload = {
            type: "fixed",
            originalPrice: Number(originalPrice),
            discountRate: Number(discountRate),
            currency,
            isOfferable,
            requestRequired
        };
        // 👇 Son değilse payload'a `_id` ekle
        if (priceHistory[activeIndex] && activeIndex !== priceHistory.length - 1) {
            payload._id = priceHistory[activeIndex]._id;
        }

        dispatch(updateProductPrice({ companyid, productid, payload }));
    };
    const handleDeletePrice = () => {
        const id = priceHistory[activeIndex]?._id;
        if (!id) return;

        if (window.confirm("Bu fiyat bilgisini silmek istediğine emin misin?")) {
            dispatch(deleteProductBasePriceItem({ companyid, productid, priceid: id }));
        }
    };
    return (
        <Modal
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
                                    <div className="d-flex flex-col form-container w-100 justify-between">

                                        {isGetLoading && (
                                            <div className="text-center my-3">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        )}
                                        <div className="form-header">
                                            <Row>
                                                <Col>
                                                    <h2 className="form-title">Ürünün Fiyatını güncelle</h2>
                                                    <p className="form-description">
                                                        ürün fiyatları güncellenmez. yeni bir fiyat bilgisi olarak eklenir.
                                                    </p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="d-flex align-middle justify-content-between w-100 align-items-center mb-3">
                                                        {/* ◀️ Geri */}
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                                                            disabled={activeIndex === 0}
                                                        >
                                                            ◀️ Geri
                                                        </Button>

                                                        {/* Fiyat Tarihi Ortada */}
                                                        <div className="fw-semibold text-center flex-grow-1">
                                                            <span className="me-2">Fiyat Tarihi:</span>
                                                            {priceHistory[activeIndex]?.createdAt
                                                                ? new Date(priceHistory[activeIndex].createdAt).toLocaleString("tr-TR")
                                                                : "—"}
                                                        </div>

                                                        {/* İleri ▶️ */}
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => setActiveIndex((prev) => Math.min(prev + 1, priceHistory.length - 1))}
                                                            disabled={activeIndex === priceHistory.length - 1}
                                                        >
                                                            İleri ▶️
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>


                                        </div>
                                        <Form onSubmit={handleSubmitForm}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm={4}>Satış Fiyatı</Form.Label>
                                                <Col sm={5}>
                                                    <Form.Control
                                                        type="text"
                                                        name="originalPrice"
                                                        value={originalPriceDisplay}
                                                        onChange={(e) => {
                                                            const parsed = parseCurrency(e.target.value);
                                                            setOriginalPrice(parsed);
                                                            setOriginalPriceDisplay(e.target.value);
                                                        }}
                                                        placeholder="₺ Satış fiyatı"
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
                                                <Form.Label column sm={4}>İndirim Oranı (%)</Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="number"
                                                        name="discountRate"
                                                        value={discountRate}
                                                        onChange={(e) => setDiscountRate(e.target.value.replace(/[^\d.]/g, ""))}
                                                        placeholder="% indirim oranı"
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm={4}>İndirimli Fiyat</Form.Label>
                                                <Col sm={5}>
                                                    <Form.Control
                                                        type="text"
                                                        name="discountedPrice"
                                                        value={discountedPriceDisplay}
                                                        onChange={(e) => {
                                                            const parsed = parseCurrency(e.target.value);
                                                            setDiscountedPrice(parsed);
                                                            setDiscountedPriceDisplay(e.target.value);
                                                        }}
                                                        placeholder="₺ İndirimli fiyat"
                                                    />
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Label className="pt-2">{currency}</Form.Label>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3">
                                                <Col sm={{ span: 10, offset: 2 }}>
                                                    {activeIndex === priceHistory.length - 1 ? (
                                                        <Button type="submit" variant="primary" disabled={isUpdateLoading}>
                                                            💾 Ekle
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button type="submit" variant="warning" disabled={isUpdateLoading}>
                                                                📝 Güncelle
                                                            </Button>{" "}
                                                            <Button variant="danger" onClick={handleDeletePrice}>
                                                                🗑️ Sil
                                                            </Button>
                                                        </>
                                                    )}
                                                </Col>
                                            </Form.Group>
                                        </Form>
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
