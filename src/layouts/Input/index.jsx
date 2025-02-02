import React, { useState } from 'react'
import { Link } from "react-router-dom";
import logo_text_transparent from "../../assets/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons'
import logo from "../../assets/logo.png"
import { Button, Modal as BootstrapModal } from 'react-bootstrap'
export default function Input() {
    return (
        <div className="chat-input">
            <input type="text" placeholder="ChatGPT uygulamasına ileti gönder" />
        </div>
    )
}
