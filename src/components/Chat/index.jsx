import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/authContext";
import HumanMessage from './HumanMessage';
import SystemMessage from './SystemMessage';
import Question from '../QuestionComponent';
import Recommendation from '../Recommendation';
import { Row, Col } from 'react-bootstrap';
import AgentFeedbackViewer from '../../components/AgentFeedbackViewer';
import { DETAILVIEW, QUESTIONVIEW, RECOMMENDATOINVIEW } from 'constant/chatContentConstant';
import useAgentSocket from "../../hooks/useAgentSocket";
import useChat from "../../hooks/useChat";

export default function Chat({ viewState }) {
    const { t } = useTranslation("global");
    const { isLogin } = useAuth();
    const [humanMessage, setHumanMessage] = useState("");
    const [assistans, setAssistans] = useState("")
    const { systemMessage, isConversationLoading, viewAction } = useChat()
    const [recommendation, setRecommendation] = useState({})
    const [assistansIntent, setAssistansIntent] = useState("")
    const [chatView, setChatView] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    // Mesajları stream olarak işleme
    useEffect(() => {
        console.log("messages", systemMessage)
        setIsLoading(false)
        // Her yeni messages prop'unda state'leri sıfırla
        setHumanMessage("");
        setAssistans("");

        // Yeni mesajları ata (stream mantığına uygun)
        if (Array.isArray(systemMessage) && systemMessage.length >= 2) {
            setHumanMessage(systemMessage[0].content || ""); // İnsan mesajı (ör. 'merhaba')
            setAssistans(systemMessage[1].content || ""); // Sistem mesajı (stream gelen)
        }
    }, [systemMessage]);


    useEffect(() => {
        if (viewAction == "recommendation") {
            setChatView(RECOMMENDATOINVIEW)
        } else if (viewAction == "detail") {
            setChatView(DETAILVIEW)
        }
    }, [viewAction])

    useEffect(() => {
        if (viewState == "recommendation") {
            setChatView(RECOMMENDATOINVIEW)
        } else if (viewState == "detail") {
            setChatView(DETAILVIEW)
        }
    }, [viewState])


    useEffect(() => {
        console.log("isConversationLoading", isConversationLoading)
        setIsLoading(isConversationLoading)
    }, [isConversationLoading])


    const selectedAction = (chatView, item) => {
        console.log("viewAction, item",chatView, assistansIntent, item)
        if (!item) return null;

        switch (chatView) {
            case "none":
                return <>none</>;
            case QUESTIONVIEW:
                return (
                    <Question
                        questions={{
                            productionQuestions: item.productionQuestions || [],
                            servicesQuestions: item.servicesQuestions || [],
                        }}
                    />
                );
            case RECOMMENDATOINVIEW:
                console.log("RECOMMENDATOINVIEW", RECOMMENDATOINVIEW, (item?.recommendation))
                return <Recommendation recommendation={item.recommendation} />;
            case DETAILVIEW:
                return <>DETAY EKRANI</>;
            default:
                return null;
        }
    };

    // Yükleniyor durumu
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

    // Mesajlar boşsa
    if (!systemMessage || !Array.isArray(systemMessage) || systemMessage.length === 0) {
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
                {humanMessage ? (
                    <li key="human-message">
                        <HumanMessage message={humanMessage} />
                    </li>
                ) : null}
                {systemMessage ? (
                    <li key="system-message">
                        <SystemMessage message={assistans} isStreaming={true} />
                    </li>
                ) : null}

                {chatView ? (
                    <li key="intent">{selectedAction(chatView, systemMessage[1])}</li>
                ) : null}
            </ul>
        </div>
    );
}