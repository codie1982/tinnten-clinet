import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faElevator,
} from '@fortawesome/free-solid-svg-icons'
import{Form} from "react-bootstrap"
export default function Input({ position, sendPromt, }) {
    const [promt, setPromt] = useState('');

    const handleInputChange = (e) => {
        setPromt(e.target.value);
    };

    const handleSubmit = () => {
        sendPromt(promt);
        setPromt('');
    };

    return (
        <Form className={`chat-input ${position}`} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Form.Control 
                type="text" 
                placeholder="Tinnten uygulamasına ileti gönder" 
                value={promt}
                onChange={handleInputChange}
            />
            <button type="submit"><FontAwesomeIcon icon={faElevator} /></button>
        </Form>
    )
}
