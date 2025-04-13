import React, { useState, useRef, useEffect } from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faElevator, faTimes, faPaperPlane
} from '@fortawesome/free-solid-svg-icons'
import { Form } from "react-bootstrap"
const TAGS = ['Elektronik', 'Moda', 'Yazılım', 'Oyun', 'Kitap', 'Finans'];

export default function Input({ position, sendMessage }) {
    const [promt, setPromt] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const suggestionsRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(promt)
        setPromt("")
    }
    const handleInputChange = (e) => {
        const value = e.target.value;
        setPromt(value);
        // @ işareti ile ya da kelime uzunluğu 2 karakterden fazlaysa göster
        const trigger = value.startsWith('@');
        setShowSuggestions(trigger);
    };


    const handleTagSelect = (tag) => {
        setSelectedTags([...selectedTags, tag]);
        setPromt((prev) => prev.replace(/@\w*$/, '')); // @xyz sil
        setShowSuggestions(false);
    };
    const handleTagClick = (tag) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <form className={`chat-input ${position}`} onSubmit={handleSubmit}>
                <div className="input-heading">Nasıl yardımcı olabilirim?</div>
                <div className="input-container">
                    <div className="tag-container">
                        {selectedTags.map((tag) => (
                            <span className="tag-chip" key={tag} onClick={() => handleTagClick(tag)}>
                                {tag}
                                <FontAwesomeIcon icon={faTimes} className="tag-remove" />
                            </span>
                        ))}
                    </div>

                    <div class="input-wrapper">
                        <input
                            type="text"
                            placeholder="Tinnten uygulamasına ileti gönder"
                            value={promt}
                            onChange={handleInputChange}
                        />
                        <button type="submit">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                    {showSuggestions && (
                        <div className="mention-popup" ref={suggestionsRef}>
                            {TAGS.filter(tag => tag.toLowerCase().startsWith(promt.split('@').pop().toLowerCase())).map(tag => (
                                <div key={tag} className="mention-item" onClick={() => handleTagSelect(tag)}>
                                    @{tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </>

    );
}
