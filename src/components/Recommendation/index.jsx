import React, { useEffect, useState } from 'react'

import {
    Accordion,
} from 'react-bootstrap'
import ProductRecommendation from './ProductRecommendation';
import ServicesRecommendation from "./ServicesRecommendation"
import CompanyRecommandation from "./CompanyRecommandation"
import { use } from 'i18next'

export default function Recommendation({ recommendation }) {
    const [itemRecommendation, setItemRecommendation] = useState(null)
    useEffect(() => {
        if (recommendation != null) {
            console.log("recommendation", recommendation)
            setItemRecommendation(recommendation)
        }
    }, [recommendation])

    useEffect(() => {
        console.log("itemRecommendation", itemRecommendation)
    }, [itemRecommendation])

    return (
        itemRecommendation != null ? (
            <>
                {(itemRecommendation.producsGroup?.length > 0) ? <ProductRecommendation products={itemRecommendation.producsGroup} /> : <></>}
                {(itemRecommendation.servicesGroup?.length > 0) ? <ServicesRecommendation services={itemRecommendation.servicesGroup} /> : <></>}
                {(itemRecommendation.companyGroup?.length > 0) ? <CompanyRecommandation companies={itemRecommendation.companyGroup} /> : <></>}
            </>
        ) : <></>
    )
}
