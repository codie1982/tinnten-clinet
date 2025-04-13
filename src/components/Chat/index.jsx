import React, { useEffect,useState } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/authContext";
import HumanMessage from './HumanMessage'; // örnek olarak
import SystemMessage from './SystemMessage';
import Question from '../QuestionComponent';
import Recommendation from '../Recommendation';
import { Row, Col } from 'react-bootstrap';
import AgentFeedbackViewer from '../../components/AgentFeedbackViewer';
import { DETAILVIEW, QUESTIONVIEW, RECOMMENDATOINVIEW } from 'constant/chatContentConstant';
import useAgentSocket from "../../hooks/useAgentSocket"; // useAgentSocket import
export default function Chat({ viewAction, messages, isLoading }) {
    const [t] = useTranslation("global");
    const { isLogin } = useAuth();
    const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);
    const { feedbackList } = useAgentSocket(); // WebSocket verilerini al
    const [streamMessages, setStreamMessages] = useState([]); // Stream için yerel state

    // Stream verilerini işleme
    useEffect(() => {
        if (feedbackList?.length > 0) {
            console.log("[Chat] Yeni stream verisi:", feedbackList);

            // Son stream verisini al
            const latestFeedback = feedbackList[feedbackList.length - 1];

            // Stream token’larını birleştir
            setStreamMessages((prev) => {
                // Mevcut stream mesajını güncelle veya yeni ekle
                const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
                if (lastMessage && lastMessage.type === "stream_message") {
                    // Mevcut stream mesajına ekle
                    return [
                        ...prev.slice(0, -1),
                        {
                            ...lastMessage,
                            content: lastMessage.content + latestFeedback,
                        },
                    ];
                } else {
                    // Yeni stream mesajı oluştur
                    return [
                        ...prev,
                        {
                            type: "stream_message",
                            content: latestFeedback,
                        },
                    ];
                }
            });
        }
    }, [feedbackList]);

    const selectedAction = (viewAction, item) => {
        switch (viewAction) {
            case "none":
                return <>none</>;
            case QUESTIONVIEW:
                return (
                    <Question
                        questions={{
                            productionQuestions: item.productionQuestions,
                            servicesQuestions: item.servicesQuestions,
                        }}
                    />
                );
            case RECOMMENDATOINVIEW:
                if (item?.recommendations != null) {
                    return <Recommendation recommendations={item.recommendations} />;
                }
                break;
            case DETAILVIEW:
                return <>DETAY EKRANI</>;
            default:
                return null;
        }
    };

    // 1️⃣ Eğer yükleniyorsa göster
    if (isLoading) {
        return (
            <div className="chat-loading-container">
                <Row>
                    <Col>
                        <div className="chat-loading-spinner">
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            {t("chat.loading") || "Yükleniyor..."}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    // ✅ Güvenli boş kontrolü
    const isEmpty =
        (!messages || !Array.isArray(messages) || messages.length === 0) &&
        streamMessages.length === 0;

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

    // Mesajları birleştir: statik (messages) + stream (streamMessages)
    const combinedMessages = [
        ...(Array.isArray(messages) ? messages : []),
        ...streamMessages,
    ];

    return (
        <div className="chat-messages">
            <ul>
                {combinedMessages.map((message, index) => (
                    <li className="message" key={index}>
                        {message.type === "human_message" ? (
                            <HumanMessage message={message.content} />
                        ) : message.type === "stream_message" ? (
                            <SystemMessage message={message.content} isStreaming={true} />
                        ) : (
                            <SystemMessage message={message.content} />
                        )}
                        {viewAction && message.action
                            ? selectedAction(viewAction, message)
                            : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}

