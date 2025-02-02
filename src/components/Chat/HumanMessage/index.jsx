import React from 'react'
import {
    Row, Col
} from 'react-bootstrap'
export default function HumanMessage({ message }) {
    return (
        <div className="human-message">
            <Row>
                <Col>
                    <div className="sub-message-content">
                        <h3 className="message-title">siz</h3>
                        <div className="message-content">{message}</div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
