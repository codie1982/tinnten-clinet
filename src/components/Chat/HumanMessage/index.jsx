import React from 'react'
import {
    Row, Col
} from 'react-bootstrap'
import { useTranslation } from "react-i18next"
export default function HumanMessage({ message }) {
      const [t, i18n] = useTranslation("global")
    return (
        <div className="human-message">
            <Row>
                <Col>
                    <div className="sub-message-content">
                        <h3 className="message-title">{t("humanMessage.you")}</h3>
                        <div className="message-content">{message}</div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
