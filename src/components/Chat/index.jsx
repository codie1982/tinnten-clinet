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
import HumanMessage from './HumanMessage'
import SystemMessage from './SystemMessage';

import Recommendation from '../../components/Recommendation';
import Question from '../../components/QuestionComponent';

export default function Chat({ openDetail, response }) {
    const [t, i18n] = useTranslation("global")
    const [isOpenProductDetail, setIsOpenProductDetail] = useState(false)


    const selectedAction = (item) => {
        switch (item.action) {
            case "none":
                return <></>
            case "question":
                let questions = { productionQuestions: item.productionQuestions, servicesQuestions: item.servicesQuestions }
                return <Question questions={questions} />

            case "recommendation":
                if (item?.recommendations != null) {
                    return <Recommendation recommendations={item?.recommendations} />
                }
                break;
            default:
                break;
        }

    }
    if (response?.size == 0 || response == null)
        return <></>
    return (
        <div className={`chat-messages`}>
            <ul>
                {
                    response.map((item, index) => {
                        console.log("item",item)
                        return (
                            <li className="message " key={index}>
                                {item.type == "human_message'" ? <HumanMessage message={item.content} /> : <SystemMessage message={item.content} />}
                                {item.action != null ? <>{selectedAction(item)}</> : <></>}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}




