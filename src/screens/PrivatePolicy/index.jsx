import React from 'react'
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next"

export default function PrivatePolicy() {
      const [t, i18n] = useTranslation("global")
  
  return (
    <>
      <div className="page-inside">
        <div className="page-section">
          <h1 className="page-title page-content-center">{t("policy.policy1")}</h1>
        </div>
        <div className="page-section">
          <div className="page-description"><p>{t("policy.policy2")}</p></div>
        </div>
        <div className="page-section">

          <div className="page-description">
            <p>{t("policy.policy3")}</p>
            <p>{t("policy.policy4")}</p>
          </div>
          <h2 className='page-title'>{t("policy.policy5")}</h2>
          <p>{t("policy.policy6")}</p>
          <h3 className="page-sub-title">{t("policy.policy7")}</h3>
          <div className="page-description">
            <ul>
              <li> {t("policy.policy8")}</li>
              <li> {t("policy.policy9")}</li>
              <li> {t("policy.policy10")}</li>
            </ul>
          </div>


          <h3 className="page-sub-title">{t("policy.policy11")}</h3>
          <div className="page-description">
            <ul>
              <li> {t("policy.policy12")}</li>
              <li> {t("policy.policy13")}</li>
              <li> {t("policy.policy14")}</li>
            </ul>
          </div>


          <h3 className="page-sub-title">{t("policy.policy15")}</h3>
          <div className="page-description">
            <ul>
              <li> {t("policy.policy16")}</li>
            </ul>
          </div>

          <h3 className="page-sub-title">{t("policy.policy17")}</h3>
          <div className="page-description">
            <p>{t("policy.policy18")}</p>
            <ul>
              <li> {t("policy.policy19")}</li>
              <li> {t("policy.policy20")}</li>
              <li> {t("policy.policy21")}</li>
              <li> {t("policy.policy22")}</li>
              <li> {t("policy.policy23")}</li>
            </ul>
          </div>

          <h3 className="page-sub-title">{t("policy.policy24")}</h3>
          <div className="page-description">
            <p>{t("policy.policy25")}</p>
          </div>

          <h2 className="page-sub-title">{t("policy.policy26")}</h2>
          <h3 className="page-sub-title">{t("policy.policy27")}</h3>
          <div className="page-description">
            <p>{t("policy.policy28")}</p>
          </div>

          <h3 className="page-sub-title">{t("policy.policy29")}</h3>
          <div className="page-description">
            <p>{t("policy.policy30")}</p>
            <ul>
              <li>	{t("policy.policy31")}</li>
              <li>	{t("policy.policy32")}</li>
            </ul>
            <p>{t("policy.policy33")}</p>

          </div>


          <h2 className='page-title'>{t("policy.policy34")}</h2>
          <div className="page-description">
            <p>{t("policy.policy35")}</p>
            <ul>
              <li>	{t("policy.policy36")}</li>
              <li>	{t("policy.policy37")}</li>
              <li>	{t("policy.policy38")}</li>
              <li>	{t("policy.policy39")}</li>
              <li>	{t("policy.policy40")}</li>
            </ul>
          </div>




          <h2 className="page-sub-title">{t("policy.policy41")}</h2>
          <div className="page-description">
            <p>{t("policy.policy42")}</p>
            <ul>
              <li>	{t("policy.policy43")}</li>
              <li>	{t("policy.policy44")}</li>
              <li>	{t("policy.policy45")}</li>
            </ul>
          </div>

          <h2 className="page-sub-title">{t("policy.policy46")}</h2>
          <div className="page-description">
            <ul>
              <li>	{t("policy.policy47")}</li>
              <li>	{t("policy.policy48")}</li>
              <li>	{t("policy.policy49")}</li>
            </ul>
          </div>


          <h2 className="page-sub-title">{t("policy.policy50")}</h2>

          <div className="page-description">
            <p>{t("policy.policy51")}</p>
            <ul>
              <li>	{t("policy.policy52")}</li>
              <li>	{t("policy.policy53")}</li>
              <li>	{t("policy.policy54")}</li>
              <li>	{t("policy.policy55")}</li>
              <li>	{t("policy.policy56")}</li>
            </ul>
            <p>{t("policy.policy57")} </p>
          </div>


          <h2 className="page-sub-title">{t("policy.policy58")}</h2>
          <div className="page-description">
            <p>{t("policy.policy59")}</p>
          </div>


          <h2 className="page-sub-title">{t("policy.policy60")}</h2>
          <div className="page-description">
            <p>{t("policy.policy61")}</p>
          </div>

          <h2 className="page-sub-title">{t("policy.policy62")}</h2>
          <div className="page-description">
            <p>{t("policy.policy63")}</p>
          </div>


          <h2 className="page-sub-title">{t("policy.policy64")}</h2>
          <div className="page-description">
            <p>{t("policy.policy65")}</p>
          </div>


          <h2 className="page-sub-title">{t("policy.policy66")}</h2>
          <div className="page-description">
            <p>{t("policy.policy67")}</p>
          </div>

          <h2 className="page-sub-title">{t("policy.policy68")}</h2>
          <div className="page-description">
            <p>{t("policy.policy69")}</p>
          </div>
        </div>
      </div>
    </>
  )
}
