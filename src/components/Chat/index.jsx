import React, { useState, useEffect } from 'react'
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

import ProductRecommendation from '../../components/Recommendation/ProductRecommendation';
export default function Chat({ openDetail, response }) {
    const [t, i18n] = useTranslation("global")
    const [isOpenProductDetail, setIsOpenProductDetail] = useState(false)

    useEffect(() => {
        console.log("response", response)
    }, [response])


    if (response?.size == 0 || response == null)
        return <></>
    return (
        <div className={`chat-messages`}>
            <ul>
                {
                    response.map((item, index) => {
                        return (
                            <li className="message " key={index}>
                                {item.type == "human_message'" ? <HumanMessage message={item.content} /> : <SystemMessage message={item.content} />}
                                {
                                    item.systemData.recommendations != null && item.systemData.recommendations.length != 0 ? <>
                                        {item.systemData?.recommendations.type == "productRecommendation" ?
                                            <>
                                                <ProductRecommendation recommendation={item} />
                                            </>
                                            :
                                            <></>}
                                        {item.systemData?.recommendations.type == "productRecommendation" ?
                                            <>
                                                <ProductRecommendation recommendation={item} />
                                            </>
                                            :
                                            <></>}
                                        {item.systemData?.recommendations.type == "productRecommendation" ?
                                            <>
                                                <ProductRecommendation recommendation={item} />
                                            </>
                                            :
                                            <></>}

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




