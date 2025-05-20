import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useModal } from '../ModalProvider'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { updateProductRequestForm, resetOperation } from "../../../api/product/productSlicer"
import { getForms } from "../../../api/form/dynamicFormSlicer"
import { toast } from 'react-toastify';
export default function UpdateProductRequestFormModal({ companyid, productid, onRefresh }) {
    const dispatch = useDispatch()
    const [active, setActive] = useState(false);
    const { closeModal, isOpen, modals } = useModal();
    const { isLoading: isProductLoading, isSuccess: isProductSuccess, isError: isProductError, operation: productOperation } = useSelector(state => state.product)
    const { formList, isLoading, isSuccess, isError, message, operation } = useSelector(state => state.dynamicform)
    const [isGetLoading, setIsGetLoading] = useState(false)
    const [selectedFormId, setSelectedFormId] = useState("")
    const [isUpdateLoading, setIsUpdateLoading] = useState(false)
    const [formsList, setFormsList] = useState([])
    useEffect(() => {
        if (isOpen("updateProductRequestForm") && companyid && productid) {
            dispatch(getForms({ companyid, productid }));
        }
    }, [isOpen("updateProductRequestForm"), companyid, productid]);

    useEffect(() => {
        if (productOperation == "updateRequestForm") {
            setIsUpdateLoading(isProductLoading)
            if (!isProductLoading && isProductSuccess && !isProductError) {
                toast.success("Güncelleme Başarılı")
                closeModal("updateProductRequestForm")
                if (onRefresh) {
                    onRefresh()
                }
            }
        }
    }, [productOperation, isProductError, isProductSuccess, isProductLoading])


    useEffect(() => {
        console.log("operation", operation, (operation === "updateRequestForm"))
        if (operation == "getForms") {
            setIsGetLoading(isLoading)
            if (!isLoading && isSuccess && !isError) {
                setFormsList(formList)
            }
        } else if (operation === "updateRequestForm") {
            console.log("DEDE")

            console.log("(!isLoading && isSuccess && !isError) ", (!isLoading && isSuccess && !isError))
            if (!isLoading && isSuccess && !isError) {
                toast.success("Güncelleme Başarılı")
                closeModal("updateProductRequestForm")
                if (onRefresh) {
                    onRefresh()
                }
            }
        }
    }, [formList, isLoading, isSuccess, isError, message, operation])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFormId) return;
        dispatch(resetOperation())
        dispatch(updateProductRequestForm({ companyid, productid, formid: selectedFormId }));
    };


    return (
        <Modal
            size='xl'
            show={isOpen("updateProductRequestForm")}
            onHide={() => closeModal("updateProductRequestForm")}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title className='feature-plan-title' id="example-modal-sizes-title-lg">
                    istek formunu güncelle
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col md={12}>
                            <div className="form-section">
                                <div className="form-content">
                                    <div className="d-flex flex-col form-container w-100 justify-between w-100">
                                        {isGetLoading && (
                                            <div className="text-center my-3">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        )}
                                        <div className="form-header">
                                            <h2 className="form-title">Form Seçimi</h2>
                                            <p className="form-description">
                                                Bu ürün için müşterilerden bilgi almak üzere kullanılacak istek formunu seçin.
                                            </p>
                                        </div>

                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm={4}>Form Listesi</Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select
                                                        value={selectedFormId}
                                                        onChange={(e) => setSelectedFormId(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Bir form seçin</option>
                                                        {formsList.map((form) => (
                                                            <option key={form._id} value={form._id}>
                                                                {form.formName}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3">
                                                <Col sm={{ span: 9, offset: 3 }}>
                                                    <Button type="submit" disabled={isUpdateLoading}>
                                                        Güncelle
                                                    </Button>
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
