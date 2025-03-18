import React from 'react'

import ProductQuestions from "./ProductQuestions"
import ServicesQuestions from "./ServicesQuestions"
export default function Question({questions}) {

    const getQuestion = (questions) => {
         console.log("getQuestion",questions)
        if (questions.productionQuestions.length != 0) {
            return <ProductQuestions questions={questions.productionQuestions} />

        } else if (questions.servicesQuestions.length != 0) {
            return <ServicesQuestions questions={questions.servicesQuestions} />

        } else {
            return <>Bu Mesajda ait bir soru bulunmuyor</>
        }
    }
    return <>{ getQuestion(questions) }</>

}
