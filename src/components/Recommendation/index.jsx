import React, { useEffect, useState } from 'react'

import {
    Accordion,
} from 'react-bootstrap'
import ProductRecommendation from "./ProductRecommendation"
import ServicesRecommendation from "./ServicesRecommendation"
import CompanyRecommandation from "./CompanyRecommandation"
import { use } from 'i18next'

export default function Recommendation({recommendations}) {
    const [itemRecommendation, setItemRecommendation] = useState([])
    useEffect(() => {
        setItemRecommendation(recommendations)
    }, [recommendations])
    useEffect(() => {
     console.log("itemRecommendation",itemRecommendation)
    }, [itemRecommendation])
    


    const getRecommendationType = (recom, type,index) => {
        switch (type) {
            case "productRecommendation":
                return <ProductRecommendation recommendation={recom} key={index} />
            case "serviceRecommendation":
                return <ServicesRecommendation recommendation={recom} />
            case "companyRecommendation":
                return <CompanyRecommandation recommendation={recom} />
            default:
                break;
        }
    }
    return (
        
        <>
            <Accordion defaultActiveKey={['0']} alwaysOpen={true} flush>
                {itemRecommendation.length != 0 && itemRecommendation?.map((recom,index) => {
                   return getRecommendationType(recom, recom.type,index)
                })}
            </Accordion>
        </>
    )
}
