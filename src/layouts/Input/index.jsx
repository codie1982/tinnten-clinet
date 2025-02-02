import React, { useState } from 'react'
import { Link } from "react-router-dom";
import logo_text_transparent from "../../assets/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faElevator,
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons'
import logo from "../../assets/logo.png"
import { Button, Modal as BootstrapModal } from 'react-bootstrap'
export default function Input() {
    const [position, setPosition] = useState("middle")

    const setChatInputPosition = () => {
        setPosition(position == "middle" ? "bottom" : "middle")
        
    }
    return (
        <div className={`chat-input ${position}`}>
            <input type="text" placeholder="ChatGPT uygulamasına ileti gönder" />
            <button onClick={() => { setChatInputPosition() }}><FontAwesomeIcon icon={faElevator} /></button>
        </div>
    )
}
