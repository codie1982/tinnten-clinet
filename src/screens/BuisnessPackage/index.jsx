import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDollar, faTurkishLira } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useAuth } from 'context/authContext';

import useAgentSocket from "../../hooks/useAgentSocket";
import { uploadprofileimage } from "../../api/upload/uploadSlicer"
import { updateProfile } from "../../api/profile/profileSlicer"
import { toast } from 'react-toastify'
import { useModal } from '../../components/Modals/ModalProvider'
import tinntenLogo from "../../assets/char-logo.png"
import UserPackagesModal from "../../components/Modals/UserPackagesModal";
import { getbuisnesspackages } from "../../api/system-packages/systempackagesSlicer"

export default function BuisnessPackage({onSelectedPackage}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const [packages, setPackages] = useState([])


  const { isLoading, isSuccess, isError, system_buisness_packages } = useSelector((state) => state.systempackages);



  useEffect(() => {
    dispatch(getbuisnesspackages())
  }, [])

  useEffect(() => {
    console.log("system_packages : ", isLoading, isSuccess, isError, system_buisness_packages)
    if (!isLoading && isSuccess && !isError && system_buisness_packages) {
      setPackages(system_buisness_packages)
    }
  }, [isLoading, isSuccess, isError, system_buisness_packages])

  useEffect(() => {
    console.log("packages : ", packages)
  }, [packages])


  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  if (packages.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <h1>Henüz bir paket bulunmamaktadır.</h1>
      </div>
    )
  }
  return (
    <div className="feature-plan-body">
      {packages?.map((item, index) => {
        return <>
          <div key={index} className="feature-plan-frame">
            <div className="feature-plan-title">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <div className="feature-plan-price ">
              <div className="text-section d-flex">
                {item.price > 0 ?
                  <h3 className="text-helper">
                    {item.price.currency == "TRY" ? <FontAwesomeIcon icon={faTurkishLira} /> : <FontAwesomeIcon icon={faDollar} />}
                    <span className="" style={{ textDecoration: "line-through" }}>99</span>
                  </h3>
                  :
                  <h3 className="text-helper">
                    {item.price.currency == "TRY" ? <FontAwesomeIcon icon={faTurkishLira} /> : <FontAwesomeIcon icon={faDollar} />}
                    <span className="" style={{ textDecoration: "line-through" }}>{item.price.amount}</span>
                  </h3>
                }
                {item.price.bestPrice > 0 ?
                  <h3 className="text-price">
                    {item.price.currency == "TRY" ? <FontAwesomeIcon icon={faTurkishLira} /> : <FontAwesomeIcon icon={faDollar} />}
                    {item.price.bestPrice}</h3>
                  :
                  <h3 className="text-price">Ücretsiz</h3>
                }
              </div>
              <p>{!item.duration.unlimited ? item.duration.interval == "month" ? "Aylık olarak yenilenir" : "" : "Sınırsız"}</p>
            </div>
            <div className="feature-plan-body">
              <ul>
                {item.features.map((feature, index) => {
                  return <li key={index}> <FontAwesomeIcon icon={faCheck} /> <span>{feature.item}</span></li>
                }
                )}
              </ul>
            </div>
            <Button className='feature-plan-button pro' onClick={() => { onSelectedPackage(item._id, item.title, item.name) }} disabled={item.status == "passive" ? true : false} variant="secondary" >Kayıt oluştur</Button>
          </div></>
      })}
    </div>
  );
}

/**
 *      <li> <FontAwesomeIcon icon={faCheck} /> <span>Firmanı ve hizmetlerini ekleyin</span></li>
                <li> <FontAwesomeIcon icon={faCheck} /> <span>firma içeriklerinizi ve dökümanlarınızı , PDF dosyalarını ekleyin </span></li>
                <li> <FontAwesomeIcon icon={faCheck} /> <span>Tinnten sizi iyi tanımalı ve kullanıcı sorularına sizin ile ilgili cevaplar verebilmeli</span></li>
 */

/**
 *  <div className="feature-plan-frame">
        <div className="feature-plan-title">
          <h2>Firmalar için</h2>
          <p>firmanızı ürünlerini ve hizmetlerinizi ekleyin.</p>
        </div>
        <div className="feature-plan-price ">
          <div className="text-section d-flex">
            <h3 className="text-helper"><FontAwesomeIcon icon={faDollar} /><span className="" style={{ textDecoration: "line-through" }}>99</span></h3>
            <h3 className="text-price"><FontAwesomeIcon icon={faDollar} />49</h3>
          </div>
          <p>Aylık</p>
        </div>
        <div className="feature-plan-body">
          <ul>
            <li> <FontAwesomeIcon icon={faCheck} /> <span>Firmanı ve hizmetlerini ekleyin</span></li>
            <li> <FontAwesomeIcon icon={faCheck} /> <span>firma içeriklerinizi ve dökümanlarınızı , PDF dosyalarını ekleyin </span></li>
            <li> <FontAwesomeIcon icon={faCheck} /> <span>Tinnten sizi iyi tanımalı ve kullanıcı sorularına sizin ile ilgili cevaplar verebilmeli</span></li>
          </ul>
        </div>
        <Button className='feature-plan-button pro' variant="secondary" >Kayıt oluştur</Button>
      </div>
      <div className="feature-plan-frame">
        <div className="feature-plan-title">
          <h2>Firmalar için</h2>
          <p>firmanızı ürünlerini ve hizmetlerinizi ekleyin.</p>
        </div>
        <div className="feature-plan-price ">
          <div className="text-section d-flex">
            <h3 className="text-helper"><FontAwesomeIcon icon={faDollar} /><span className="" style={{ textDecoration: "line-through" }}>199</span></h3>
            <h3 className="text-price"><FontAwesomeIcon icon={faDollar} />149</h3>
          </div>
          <p>Aylık</p>
        </div>
        <div className="feature-plan-body">
          <ul>
            <li> <FontAwesomeIcon icon={faCheck} /> <span>Firmanı ve hizmetlerini ekleyin</span></li>
            <li> <FontAwesomeIcon icon={faCheck} /> <span>firma içeriklerinizi ve dökümanlarınızı , PDF dosyalarını ekleyin </span></li>
            <li> <FontAwesomeIcon icon={faCheck} /> <span>Tinnten sizi iyi tanımalı ve kullanıcı sorularına sizin ile ilgili cevaplar verebilmeli</span></li>
          </ul>
        </div>
        <Button className='feature-plan-button pro' variant="secondary" >Kayıt oluştur</Button>
      </div>
 */