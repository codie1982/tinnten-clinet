import React from 'react'
import {
    Row, Col, Button,
    Dropdown, DropdownButton,
    ListGroup,
    Accordion, Card, Image
} from 'react-bootstrap'
import Filter from '../../Chat/Filter';
import ProductCard from '../../Chat/ProductCard';
export default function ProductRecommendation({ recommendation, key }) {
    const openDetail = () => {
        //navigate ile detay sayfasına gideriz
    }
    return (
        <>
            <Accordion.Item eventKey={`${key}`} className="product-group-list" >
                <Accordion.Header className="product-group-title"><h4>{"Ürün Grubu"}</h4></Accordion.Header>
                <Accordion.Body>

                    {/*  <Row>
                        <Col>
                            <p>Filtre Uygulayın</p>
                            {recommendation.productGroup.filter != null || recommendation.productGroup.filter.length != 0 ?
                                <Filter item={recommendation} />
                                : <></>}
                        </Col>
                    </Row> */}

                    <div className="product-list">
                        {recommendation.products.map((product) => {
                            return (
                                <ProductCard product={product} openDetail={openDetail} />
                            );
                        })}
                    </div>
                </Accordion.Body>
            </Accordion.Item>


        </>
    )
}
