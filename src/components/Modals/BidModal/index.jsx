import React, { useState, useEffect, useRef } from 'react'
import { Form, Modal, Button, Spinner, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useAuth } from '../../../context/authContext'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLessThanEqual, faR, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../ModalProvider'
import { expand, searchProductsBySemanticMatch } from '../../../api/bid/bidSlicer'
import { toast } from 'react-toastify';
import FormView from '../../../components/FormView';

export default function BidModal() {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const t = (key, params) => {
        // Çeviri fonksiyonu, örneğin i18next ile kullanılabilir
        const translations = {
            'form.preview': 'Form Önizleme',
            'form.previewDescription': 'Bu formun nasıl görüneceğini önizleyin.',
            'form.maxLengthText': 'Maksimum {max} karakter.',
            'form.select': 'Seçiniz',
            // diğer çeviriler...
        };
        return translations[key] || key;
    };
    const { closeModal, isOpen } = useModal();
    const { isLogin } = useAuth();
    const { llmDescription, results, isLoading, isSuccess, isError, operation } = useSelector((state) => state.bid);
    const [viewState, setviewState] = useState("Step1_DescriptionInput");
    const [description, setDescription] = useState("")
    const [expandLoading, setExpandLoading] = useState(false)
    const [setsearchLoading, setSetsearchLoading] = useState(false)
    const [fields, setFields] = useState([])
    useEffect(() => {
        if (operation === "expand") {
            setExpandLoading(isLoading)
            setDescription("Bekliyor...")
            if (!isLoading && isSuccess && !isError) {
                setDescription(llmDescription?.expandedDescription || "");
            }
        } else if (operation === "search") {
            setSetsearchLoading(isLoading)
            if (!isLoading && isSuccess && !isError) {
                setFields(results?.fields || []);
                setviewState("Step3_ProductMatchingAndDynamicFields");
            }
        }

    }, [llmDescription, isLoading, isSuccess, isError, operation]);

    const handleExpandWithAI = () => {
        dispatch(expand({ description: description.trim() }));
    }

    const handleMiniFormSubmit = (e) => {
        e.preventDefault();
        console.log("description:", description);
        if (!isLogin) {
            toast.error("Lütfen giriş yapın.");
            return;
        }
        if (description.trim() === "") {
            toast.error("Açıklama alanı boş bırakılamaz.");
            return;
        }
        if (description.trim().length < 20 || description.trim().length > 250) {
            toast.error("Açıklamanız 20 ile 250 karakter arasında olmalıdır.");
            return;
        }
        dispatch(searchProductsBySemanticMatch({ description: description.trim() }));
    }

    const handleSubmit = (formData) => {
        console.log('Form Verileri:', formData);
        // Örnek: Validasyon veya API çağrısı yapılabilir
        return true; // Başarılı submit için true döndür
    };

    const handleSubmitSuccess = (formData) => {
        console.log('Form başarıyla gönderildi:', formData);
        alert('Form gönderildi!');
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.submitForm();
        }
    };
    const handleFirstFieldRendered = (field) => {
        console.log('İlk alan render edildi:', field.label);
    };

    const handleLastFieldRendered = (field) => {
        console.log('Son alan render edildi:', field.label);
    };

    const handleFieldCountChange = (count) => {
        console.log('Görünen alan sayısı:', count);
    };

    const handleStepChange = (currentStep, totalSteps) => {
        console.log(`Adım değişti: ${currentStep}/${totalSteps}`);
    };

    const handleFormDataChange = (formData) => {
        console.log('Form verileri değişti:', formData);
    };
    return (
        <Modal
            size="xl"
            show={isOpen("bid")}
            onHide={() => closeModal("bid")}
            aria-labelledby="modal-bid"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="modal-bid">Teklif Al</Modal.Title>
            </Modal.Header>
            {isLoading && <Spinner animation="border" variant="primary" />}
            {viewState === "Step1_DescriptionInput" && <>
                <Modal.Body>
                    <Row className="mb-3 ">
                        <Col xs={12} md={12} className="d-flex align-items-center justify-center w-100">

                            <Form className="w-50" >
                                {/* Açıklama */}
                                <Form.Group className="mb-3 w-100" controlId="description">
                                    <Form.Label>Kısa Açıklama</Form.Label>
                                    {/* AI ikon butonu sağ üst köşede */}

                                    <Form.Control
                                        as="textarea"
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                        rows={3}
                                        placeholder="İhtiyacınızı birkaç cümle ile anlatın..."
                                    />
                                    <Form.Text light className="text-white">
                                        {description.length < 20
                                            ? `En az 20 karakter girilmelidir. (${description.length}/20)`
                                            : `Kalan karakter: ${250 - description.length}`}
                                    </Form.Text>
                                    <div className="position-absolute end-0 top-0 mt-1 me-1">

                                    </div>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeModal("bid")}>
                        Vazgeç
                    </Button>
                    <Button variant="primary" onClick={handleMiniFormSubmit} >
                        Devam Et
                    </Button>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Yazını AI ile genişlet</Tooltip>}>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleExpandWithAI}
                            disabled={description.length < 20}
                        >
                            {expandLoading ? <Spinner animation="border" size="sm" /> : <span><FontAwesomeIcon size='lg' color='#e1e1e1' icon={faRobot} /></span>}
                        </Button>
                    </OverlayTrigger>
                </Modal.Footer>
            </>
            }
            {viewState === "Step3_ProductMatchingAndDynamicFields" && <>
                <Modal.Body>
                    <Row className="mb-3 ">
                        <Col xs={12} md={12} className="d-flex align-items-center justify-center w-100">

                            {setsearchLoading && <Spinner animation="border" variant="primary" />}
                            <FormView
                                ref={formRef}
                                fields={fields}
                                t={t}
                                isPreview={false}
                                isSubmitInternal={true}
                                isStepper={true}
                                stepCount={1}
                                onSubmit={handleSubmit}
                                onSubmitSuccess={handleSubmitSuccess}
                                onFirstFieldRendered={handleFirstFieldRendered}
                                onLastFieldRendered={handleLastFieldRendered}
                                onFieldCountChange={handleFieldCountChange}
                                onStepChange={handleStepChange}
                                onFormDataChange={handleFormDataChange}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeModal("bid")}>
                        Vazgeç
                    </Button>
                    <Button variant="primary" onClick={() => handleExternalSubmit()} >
                        Devam Et
                    </Button>
                </Modal.Footer>
            </>
            }
        </Modal >
    );
}