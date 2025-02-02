import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {
    Row, Col, Button,
    Dropdown, DropdownButton,
    ListGroup,
    Accordion, Card, Image
} from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/authContext'
import charLogo from '../../assets/char-logo.png'
import HumanMessage from './HumanMessage'
import SystemMessage from './SystemMessage';
import ProductDetail from '../ProductDetail';
import Filter from './Filter';
import ProductCard from './ProductCard';
export default function Chat({ openDetail }) {

    const [t, i18n] = useTranslation("global")
    const [cookies, setCookie] = useCookies(['name']);
    const [isOpenProductDetail, setIsOpenProductDetail] = useState(false)
    const [systemResponse, setSystemResponse] = useState(
        [
            {
                human_message: "Merhaba!",
                system_message: "Tabii ki sizin için en iyi seçimleri bulmaya çalışacağım.",
                recommendation_products: [
                    {
                        productGroup: {
                            id: 1,
                            product_group_name: "Bisiklet",
                            product_list: [
                                {
                                    product_name: "15 Jant Kız Bisikleti Pembe",
                                    product_image: "https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg",
                                    product_price: "1.970,00 TL",
                                    product_brand: "Bisiklet Markası",

                                },
                                {
                                    product_name: "18 Jant Erkek Bisikleti Siyah",
                                    product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
                                    product_price: "2.500,00 TL",
                                    product_brand: "Bisiklet Markası"
                                },
                                {
                                    product_name: "15 Jant Kız Bisikleti Pembe",
                                    product_image: "https://m.media-amazon.com/images/I/71fv5NCG97L._AC_SL1500_.jpg",
                                    product_price: "1.970,00 TL",
                                    product_brand: "Bisiklet Markası"
                                },
                                {
                                    product_name: "18 Jant Erkek Bisikleti Siyah",
                                    product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
                                    product_price: "2.500,00 TL",
                                    product_brand: "Bisiklet Markası"
                                },
                                {
                                    product_name: "15 Jant Kız Bisikleti Pembe",
                                    product_image: "https://m.media-amazon.com/images/I/61SDGi3p00L.__AC_SY300_SX300_QL70_ML2_.jpg",
                                    product_price: "1.970,00 TL",
                                    product_brand: "Bisiklet Markası"
                                },
                                {
                                    product_name: "18 Jant Erkek Bisikleti Siyah",
                                    product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
                                    product_price: "2.500,00 TL",
                                    product_brand: "Bisiklet Markası"
                                },
                                {
                                    product_name: "18 Jant Erkek Bisikleti Siyah",
                                    product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
                                    product_price: "2.500,00 TL",
                                    product_brand: "Bisiklet Markası"
                                },
                                {
                                    product_name: "18 Jant Erkek Bisikleti Siyah",
                                    product_image: "https://productimages.hepsiburada.net/s/424/960-1280/110000454576458.jpg",
                                    product_price: "2.500,00 TL",
                                    product_brand: "Bisiklet Markası"
                                }
                            ],
                            filter: [
                                {
                                    id: 11,
                                    title: "brand",
                                    options: ["marka-1", "marka-2", "marka-3"],
                                },
                                {
                                    id: 12,
                                    title: "color",
                                    options: ["renk-1", "renk-2", "renk-3"],
                                },
                                {
                                    id: 13,
                                    title: "size",
                                    options: ["size-1", "size-2", "size-3"]
                                }
                            ]
                        }
                    },
                    {
                        productGroup: {
                            id: 2,
                            product_group_name: "Bisiklet Aksesuarları",
                            product_list: [
                                {
                                    product_name: "Bisiklet Kaskı",
                                    product_image: "bisiklet_kaski.jpg",
                                    product_price: "150,00 TL",
                                    product_brand: "Aksesuar Markası",
                                },
                                {
                                    product_name: "Bisiklet Çantası",
                                    product_image: "bisiklet_cantasi.jpg",
                                    product_price: "100,00 TL",
                                    product_brand: "Aksesuar Markası",
                                }
                            ],
                            filter: [
                                {
                                    id: 21,
                                    title: "brand",
                                    options: ["marka-1", "marka-2", "marka-3"],
                                },
                                {
                                    id: 22,
                                    title: "color",
                                    options: ["renk-1", "renk-2", "renk-3"],
                                },
                                {
                                    id: 23,
                                    title: "size",
                                    options: ["size-1", "size-2", "size-3"]
                                }
                            ]
                        }
                    }
                ],
            },
        ]
    )



    return (
        <div className={`chat-messages hidden`}>
            <ul>
                {
                    systemResponse.map((item, index) => {
                        return (
                            <li className="message ">
                                <HumanMessage message={item.human_message} />
                                <SystemMessage message={item.system_message} />

                                {
                                    item.recommendation_products != null ? <>
                                        <p>Önerilen Ürünler:</p>
                                        <Accordion defaultActiveKey="1" alwaysOpen>

                                            {item.recommendation_products.map((item, index) => {
                                                return (
                                                    <Accordion.Item eventKey={index} className="product-group-list" key={item.productGroup.product_group_name}>
                                                        <Accordion.Header className="product-group-title"><h4>{item.productGroup.product_group_name}</h4></Accordion.Header>
                                                        <Accordion.Body>
                                                            <Row>
                                                                <Col>
                                                                    <p>Filtre Uygulayın</p>
                                                                    {item.productGroup.filter != null || item.productGroup.filter.length != 0 ?
                                                                        <Filter item={item} />
                                                                        : <></>}
                                                                </Col>
                                                            </Row>
                                                            <div className="product-list">
                                                                {item.productGroup.product_list.map((product) => {
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
                                        :
                                        <></>
                                }
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
