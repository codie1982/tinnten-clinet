import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/authContext";
import HumanMessage from './HumanMessage'; // örnek olarak
import SystemMessage from './SystemMessage';
import Question from '../QuestionComponent';
import Recommendation from '../Recommendation';
import { Row, Col } from 'react-bootstrap';

export default function Chat({ openDetail, response, isLoading }) {
    const [t] = useTranslation("global");
    const { isLogin } = useAuth();
    const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);

    const selectedAction = (item) => {
        switch (item.action) {
            case "none":
                return <></>;
            case "question":
                return <Question questions={{
                    productionQuestions: item.productionQuestions,
                    servicesQuestions: item.servicesQuestions
                }} />;
            case "recommendation":
                if (item?.recommendations != null) {
                    return <Recommendation recommendations={item.recommendations} />;
                }
                break;
            default:
                return null;
        }
    };

    // 1️⃣ Eğer yükleniyorsa göster:
    if (isLoading) {
        return (
            <div className="chat-loading-spinner">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {t("chat.loading") || "Yükleniyor..."}
            </div>
        );
    }
    // ✅ Güvenli boş kontrolü
    const isEmpty = !response || !Array.isArray(response) || response.length === 0;

    if (isEmpty) {
        return (

            <div className="empty-message">
                <Row>
                    <Col>
                        <div className="sub-message-content">
                            {t("chat.empty") || "Bu konuşmada herhangi bir mesaj bulunmuyor."}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div className="chat-messages">
            <ul>
                {response.map((item, index) => (
                    <li className="message" key={index}>
                        {item.type === "human_message" ? (
                            <HumanMessage message={item.content} />
                        ) : (
                            <SystemMessage message={item.content} />
                        )}
                        {item.action && selectedAction(item)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
