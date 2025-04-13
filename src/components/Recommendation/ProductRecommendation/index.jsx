import React from 'react'
import { Row, Col, Accordion, } from 'react-bootstrap'
import Filter from '../../Chat/Filter';
import ProductCard from '../../Chat/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import AuxiliaryProductItem from '../../AuxiliaryProductItem';
import { getProductDetail } from "../../../api/product/productSlicer";
import MarkdownEditor from '../../Common/MarkdownEditor';
export default function ProductRecommendation({ recommendation, content, key }) {
    const dispatch = useDispatch()
    const openDetail = (productid) => {
        //navigate ile detay sayfasına gideriz
        if (productid == null || productid == undefined) return;
        dispatch(getProductDetail({ productid }))
    }
    return (
        <Accordion defaultActiveKey="0" key={key} alwaysOpen={true} flush>
            <Accordion.Item eventKey="0" className="product-group-list">
                <Accordion.Header className="product-group-title flex-column align-items-start">
                    <Row>
                        <Col>
                            <Row>
                                <Col lg={6} md={6} sm={12} xs={12} className="d-flex justify-content-between">
                                    <span className='recommendation-header-title'>{"Ürün Grubu - "}{recommendation.groupname}</span>
                                </Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col lg={12} md={12} sm={12} xs={12} className="d-flex justify-content-between">
                                    <span className="recommendation-header-description mt-1">{recommendation.explanation}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Accordion.Header>
                <Accordion.Body style={{  overflow: "hidden" }}>
                    <Row className='mt-1'>
                        <Col lg={9} md={9} sm={9} xs={12} className="d-flex justify-content-between">
                            <Row className='mt-1'>
                                <Col lg={12} md={12} sm={12} xs={12} className="d-flex justify-content-between">
                                    <MarkdownEditor value={recommendation.system_message} />
                                    {/* <span className="recommendation-body-system-message mt-1">{recommendation.system_message}</span> */}
                                </Col>
                                <Row>
                                    <Col>
                                        {recommendation.products.length !== 0 ?
                                            <div className="product-list">
                                                {recommendation.products.main.map((product, index) => (
                                                    <ProductCard key={index} product={product} openDetail={() => { openDetail(product._id) }} />
                                                ))}
                                            </div>
                                            : <Row className='mt-1'>
                                                <Col lg={12} md={12} sm={12} xs={12} className="d-flex justify-content-between">
                                                    <span className="recommendation-body-system-message mt-1">{"Ürün bulunamadı"}</span>
                                                </Col>
                                            </Row>
                                        }
                                    </Col>
                                </Row>
                            </Row>
                        </Col>
                        <Col
                            lg={3} md={3} sm={3} xs={12}
                            className="d-flex justify-content-between mt-2"
                            style={{

                                overflowY: "auto",
                                maxHeight: "550px" // Aynı yükseklik
                            }}
                        >
                            <ul className='product-auxiliary-content'>
                                {recommendation.products.auxiliary.map((product, index) => (
                                    <li key={index} className='product-auxiliary-list'>
                                        <AuxiliaryProductItem product={product} openDetail={openDetail} />
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )


}
