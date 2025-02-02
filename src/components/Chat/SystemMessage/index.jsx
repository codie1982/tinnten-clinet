import React from 'react'
import {
    Row, Col, Image
} from 'react-bootstrap'
import charLogo from '../../../assets/char-logo.png'
export default function SystemMessage({ message }) {
    return (
        <div className="system-message">
            <Row>
                <Col>
                    <div className="sub-message-content">
                        <h3 className="message-title"> <Image src={charLogo} roundedCircle width={35} height={35} /> </h3>
                        <div className="message-content">{message}</div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
