import React from 'react'
import {
    Row, Col, Button,
    Dropdown, DropdownButton,
    ListGroup,
    Accordion, Card, Image
} from 'react-bootstrap'
import Filter from '../../Chat/Filter';
import ProductCard from '../../Chat/ProductCard';
export default function ProductRecommendation({ recommendation }) {
    const openDetail = () => {
        //navigate ile detay sayfasına gideriz
    }
    return (
        <>
            <p>Önerilen Ürünler:</p>
            <Accordion defaultActiveKey="0" alwaysOpen>
                {recommendation.recommendation_products.map((item, index) => {
                    return (
                        <Accordion.Item eventKey={index} className="product-group-list" key={index}>
                            <Accordion.Header className="product-group-title"><h4>{recommendation.productGroup.product_group_name}</h4></Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col>
                                        <p>Filtre Uygulayın</p>
                                        {recommendation.productGroup.filter != null || recommendation.productGroup.filter.length != 0 ?
                                            <Filter item={recommendation} />
                                            : <></>}
                                    </Col>
                                </Row>
                                <div className="product-list">
                                    {recommendation.productGroup.product_list.map((product) => {
                                        return (
                                            <ProductCard product={product} openDetail={openDetail} />
                                        );
                                    })}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </>
    )
}
