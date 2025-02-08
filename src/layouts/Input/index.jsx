import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faElevator,
} from '@fortawesome/free-solid-svg-icons'
export default function Input({ position, sendPromtToTinnten }) {


    return (
        <div className={`chat-input ${position}`}>
            <input type="text" placeholder="Tinnten uygulamasına ileti gönder" />
            <button onClick={sendPromtToTinnten}><FontAwesomeIcon icon={faElevator} /></button>
        </div>
    )
}
