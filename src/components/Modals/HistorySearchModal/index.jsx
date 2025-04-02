import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap'

export default function HistorySearchModal({ isModalOpen, setIsModalOpen, onSearch, results, onSelectedItem, isSearchLoading,searchLimit ,hasMoreResults}) {
    const [active, setActive] = useState(false);
    const [searchText, setSearchText] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [searchPage, setSearchPage] = useState(1);
   

    const SEARCHLIMIT = searchLimit || 5;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchPage(1)
        onSearch(searchText, 1, SEARCHLIMIT,true)
        setSearchResults([])

    }
    useEffect(() => {
        setSearchResults(results)
    }, [results])

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            if (!isSearchLoading && hasMoreResults) {
                loadMoreResults();
            }
        }
    };
    const loadMoreResults = async () => {
        const nextPage = searchPage + 1;
        onSearch(searchText, nextPage, SEARCHLIMIT,false); // dışarıdan veri çeken fonksiyon
        setSearchPage(nextPage);
    };


    return (
        <Modal
            size="lg"
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            aria-labelledby="example-modal-sizes-title-lg plans-container"
            centered
        >
            <Modal.Header className='feature-plan-container' closeButton>
                <Modal.Title>Geçmişte Arama</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-3">
                    Aramak istediğiniz terimi girin. Sonuçlar listelenirken daha fazla veri yüklenebilir.
                </p>
                <Form onSubmit={handleSubmit}>
                    <Row className="align-items-center">
                        <Col lg="10">
                            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                                Arama Yap
                            </Form.Label>
                            <Form.Control
                                className="mb-2"
                                id="inlineFormInput"
                                placeholder="Arama yapın..."
                                name="searchText"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col lg="2">
                            <Button type="submit" className="mb-2">
                                Ara
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div className="search-list-container" onScroll={handleScroll} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <ul className="search-list">
                        {searchResults.length === 0 && !isSearchLoading ? (
                            <li className="search-list-item">Bir sonuç bulunamadı</li>
                        ) : (
                            <>
                                {searchResults.map((item, index) => {
                                    const formattedDate = new Date(item.updatedAt).toLocaleString("tr-TR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    const questionCount = item.productionQuestions?.length || 0;
                                    const recommendationCount = item.recommendations?.length || 0;

                                    const contentShort = item.content.length > 100
                                        ? item.content.substring(0, 100) + "..."
                                        : item.content;

                                    return (
                                        <li onClick={() => onSelectedItem(item)} key={index} className="search-list-item">
                                            <div className="search-item-title">
                                                {item.title}
                                                <div className="search-item-meta">
                                                    {formattedDate} – {questionCount} soru / {recommendationCount} öneri
                                                </div>
                                                <span>{item.type === "human_message" ? "Sizin mesajınız" : "Sistem cevabı"}</span>
                                            </div>

                                            <div className="search-item-description">
                                                {(() => {
                                                    if (!searchText) return item.content;
                                                    const regex = new RegExp(`(${searchText})`, 'gi');
                                                    return item.content.split(regex).map((part, i) =>
                                                        part.toLowerCase() === searchText.toLowerCase() ? (
                                                            <strong key={i}>{part}</strong>
                                                        ) : (
                                                            <span key={i}>{part}</span>
                                                        )
                                                    );
                                                })()}
                                            </div>
                                        </li>
                                    );
                                })}
                                {isSearchLoading && (
                                    <li className="search-list-item">
                                        <Spinner animation="border" role="status" />
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
                <Modal.Footer>Geçmiş konuşmalarınızdan arama yapmak ve yapılan öneri ve soruları görebilirsiniz</Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}
