import React, { useState, useEffect } from 'react'
import {
    Row, Col, Button, ListGroup,
} from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import {
    setAnswerToQuestion, deleteQuestion
} from "../../../api/conversation/conversationSlicer";
export default function ProductQuestions({ questions }) {
    const dispatch = useDispatch()
    const [questionList, setQuestionList] = useState([])

    useEffect(() => {
        setQuestionList(questions)
    }, [questions])

    const { isSuccess, isLoading, question, deletedQuestionid } = useSelector(
        (state) => state.conversation
    );

    useEffect(() => {
        if (!isLoading && isSuccess && question) {
            setQuestionList(prevList =>
                prevList.map(item =>
                    item._id === question._id ? question : item
                )
            );
        }
    }, [isSuccess, isLoading, question])
    useEffect(() => {
        if (!isLoading && isSuccess && deletedQuestionid) {
            setQuestionList(prevList =>
                prevList.filter(item => item._id !== deletedQuestionid)
            );
        }
    }, [isSuccess, isLoading, deletedQuestionid])
    const openDetail = () => {
        //navigate ile detay sayfasına gideriz
    }

    /**
     * const questionSchema = new mongoose.Schema({
        questionText: { type: String, required: true },  // LLM'in sorduğu soru
        important: { type: String, enum: ["high", "low"] },
        input_type: { type: String },
        options: [{ type: String }],
        answer: { type: String }  // Kullanıcının verdiği cevaplar
    }, { timestamps: true });
     */

    /**
     *  {
                            "important": "low",
                            "input_type": "select",
                            "q": "Bedeniniz nedir?",
                            "options": ["XS", "S", "M", "L", "XL"]
                        }
     */
    const selectedQuestionAnswer = (item, index, id) => {
        dispatch(setAnswerToQuestion({ id, answer: item }))
    }
    const handleDeleteQuestion = (id) => {
        dispatch(deleteQuestion(id))
    }

    const selectedQuestionType = (id, quest) => {
        switch (quest.input_type) {
            case "select":
                return (
                    <>
                        <ListGroup className="mt-2 mb-2 filter-section" horizontal>
                            {quest.options.map((item, index) => (
                                <Button
                                    className="filter-dropdown-button-item"
                                    onClick={() => selectedQuestionAnswer(item, index, id)}
                                    variant={quest.answer === item ? "success" : "primary"}
                                >
                                    {item}
                                </Button>
                            ))}
                        </ListGroup>

                    </>
                )
            default:
                break;
        }
    }
    return (
        <>
            <p>Ürünler için sorular:</p>
            {
                questionList != null || questionList.length != 0 ?
                    <>
                        {
                            questionList.map((quest) => {
                                return (
                                    <>
                                        <Row>
                                            <Col xl="1" >
                                                <p>Soru : </p>
                                            </Col>
                                            <Col>{quest.questionText}</Col>
                                          {/*   <Col>
                                                <Button
                                                    className=""
                                                    variant="danger"
                                                    size='sm'
                                                    onClick={() => handleDeleteQuestion(quest._id)}
                                                >
                                                    Sil
                                                </Button>
                                            </Col> */}
                                        </Row>
                                        {/* <Row>
                                            <Col>
                                                {selectedQuestionType(quest._id, quest)}
                                            </Col>
                                        </Row> */}
                                    </>
                                )
                            })
                        }
                    </> : <></>
            }


        </>
    )
}
