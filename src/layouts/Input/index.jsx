import React, { useState, useRef, useEffect } from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faElevator, faTimes, faPaperPlane
} from '@fortawesome/free-solid-svg-icons'
import { Form } from "react-bootstrap"
import useChat from "../../hooks/useChat";

const TAGS = ['Elektronik', 'Moda', 'Yazılım', 'Oyun', 'Kitap', 'Finans'];


export default function Input({ position, selectedid }) {
    const [promt, setPromt] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [recommendationProducts, setRecommendationProducts] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [selectedProductid, setSelectedProductid] = useState("");
    const suggestionsRef = useRef(null);
    const { systemMessage, sendMessage } = useChat();

    // Gelen seçili ID’yi state’e at
    useEffect(() => {
        setSelectedProductid(selectedid);
    }, [selectedid]);

    // Sistem mesajından recommendation al
    useEffect(() => {
        if (systemMessage) {
            setRecommendation(systemMessage[1]?.recommendation);
        }
    }, [systemMessage]);

    // Recommendation’dan ürünleri çıkar
    useEffect(() => {
        if (recommendation) {
            const products = recommendation.producsGroup?.flatMap(group => {
                const main = group.products?.main?.map(p => ({ id: p._id, title: p.title })) || [];
                const aux = group.products?.auxiliary?.map(p => ({ id: p._id, title: p.title })) || [];
                return [...main, ...aux];
            }) || [];
            setRecommendationProducts(products);
        }
    }, [recommendation]);

    // Harici product id gelirse otomatik seç
    useEffect(() => {
        if (selectedProductid) {
            const found = recommendationProducts.find(p => p.id === selectedProductid);
            if (found) handleProductSelect(found);
        }
    }, [selectedProductid, recommendationProducts]);

    // Prompt değişimi
    const handleInputChange = (e) => {
        const value = e.target.value;
        setPromt(value);
        setShowSuggestions(value.includes('@'));
    };

    // Ürün seçimi
    const handleProductSelect = (product) => {
        if (!selectedProducts.find(p => p.id === product.id)) {
            setSelectedProducts(prev => [product]);
        }
        setPromt(prev => prev.replace(/@\w*$/, '')); // @xyz sil
        setShowSuggestions(false);
    };

    // Ürün kaldırma
    const handleProductRemove = (id) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== id));
    };

    // Dış tıklamayı dinle
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mesaj gönder
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("selectedProductid", selectedProductid)
        sendMessage(promt, selectedProductid);
        setPromt('');
    };

    return (
        <form className={`chat-input ${position}`} onSubmit={handleSubmit}>
            <div className="input-heading">Nasıl yardımcı olabilirim?</div>
            <div className="input-container">
                {/* Seçilen ürünler */}
                <div className="tag-container">
                    {selectedProducts.map((product) => (
                        <span className="tag-chip" key={product.id} onClick={() => handleProductRemove(product.id)}>
                            {product.title}
                            <FontAwesomeIcon icon={faTimes} className="tag-remove" />
                        </span>
                    ))}
                </div>

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Ürün veya hizmet belirtin..."
                        value={promt}
                        onChange={handleInputChange}
                    />
                    <button type="submit">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>

                {/* Ürün öneri popup'ı */}
                {showSuggestions && (
                    <div className="mention-popup" ref={suggestionsRef}>
                        <>
                            {recommendationProducts?.length > 0 ?
                                <>
                                    {
                                        recommendationProducts
                                            .filter(product =>
                                                product.title.toLowerCase().startsWith(promt.split('@').pop().toLowerCase())
                                            )
                                            .map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="mention-item"
                                                    onClick={() => handleProductSelect(product)}
                                                >
                                                    @{product.title}
                                                </div>
                                            ))}
                                </> : <>Öncelikle bir ürün seçimi yapın</>}
                        </>
                    </div>
                )}
            </div>
        </form>
    );
}
/*
export default function Input({ position, sendMessage, selectedid }) {
    const [promt, setPromt] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([])
    const suggestionsRef = useRef(null);
    const [selectedProductid, setselectedProductid] = useState("")

    const { systemMessage } = useChat()

    const [recommendationProducts, setrecommendationProducts] = useState([])

    const [recommendation, setRecommendation] = useState()

    useEffect(() => {
        selectedProductid(selectedid)
    }, [selectedid])

    useEffect(() => {
        console.log("systemMessage", systemMessage)
        if (systemMessage != null) {
            setRecommendation(systemMessage[1].recommendation)
        }
    }, [systemMessage])

    useEffect(() => {

        if (recommendation != null) {
            const products = recommendation.producsGroup.flatMap(group => {
                const mainProducts = group.products.main.map(product => ({
                    id: product._id,
                    title: product.title
                }));
                const auxiliaryProducts = group.products.auxiliary.map(product => ({
                    id: product._id,
                    title: product.title
                }));
                return [...mainProducts, ...auxiliaryProducts];
            });
            console.log("products", products);
            setrecommendationProducts(products);
        }
    }, [recommendation])


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

    useEffect(() => {
        handleProductSelect(selectedProductid)
    }, [selectedProductid])

    const handleProductSelect = (product) => {

        setSelectedProduct([...selectedProduct, product]);
        setPromt((prev) => prev.replace(/@\w*$/, '')); // @xyz sil
        setShowSuggestions(false);
    };
    const handleTagClick = (tag) => {
        setSelectedProduct(prev => prev.filter(t => t !== tag));
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

                    <div className="input-wrapper">
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
                            {recommendationProducts
                                .filter(product =>
                                    product.title.toLowerCase().startsWith(promt.split('@').pop().toLowerCase())
                                )
                                .map((product, index) => (
                                    <div
                                        key={index}
                                        className="mention-item"
                                        onClick={() => handleProductSelect(product.id)}
                                    >
                                        @{product.title}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </form>
        </>
    );
}
    */
