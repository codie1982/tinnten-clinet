import React from 'react'
import MarkdownEditor from '../../Common/MarkdownEditor';

import {
    Row, Col, Image
} from 'react-bootstrap'
import charLogo from '../../../assets/char-logo.png'
export default function SystemMessage({ message }) {

    return (
        <div className="system-message">
            <Row>
                <Col xl={1}>
                    <div className="sub-message-content">
                        <h3 className="message-title"> <Image src={charLogo} roundedCircle width={35} height={35} /> </h3>
                    </div>
                </Col>
                <Col xl={11}>
                    <div className="message-content"><MarkdownEditor message={message} /></div>
                </Col>
            </Row>
        </div>
    )
}
