import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useSelector, useDispatch } from "react-redux"
import { login, register } from "../../api/auth/authSlicer"
import { Link, useNavigate, } from "react-router-dom";
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'
import HeaderNoAuth from 'layouts/HeaderNoAuth';

export default function HowWorks() {
  return (
    <>
      <div className="page-inside">
        <div className="page-section">
          <h1 className="page-title page-content-center">Nasıl Çalışır?</h1>
        </div>
        <div className="page-section">
          <div className="page-description">
            <p>Tinnten, yapay zeka destekli akıllı arama ve öneri motoru ile kullanıcıların aradıkları ürünleri ve hizmetleri en hızlı ve doğru şekilde bulmalarını sağlar. Geleneksel arama motorlarından farklı olarak, doğal dil işleme (NLP) ve vektör tabanlı arama teknolojileri ile çalışır.</p>
            <br />
            <h3 className='page-title'>Aramanızı Yapın</h3>
            <p>Tinnten’de aradığınız ürünü veya hizmeti doğal bir dille yazarak arayın.</p>
            <ul>
              <li>Örnek: “Ahşap yemek masası arıyorum.”</li>
              <li>Örnek: “İstanbul’da dijital pazarlama hizmeti veren firmalar hangileri?”</li>
            </ul>
            <p>Tinnten’in yapay zeka destekli arama motoru, sorgunuzu anlar ve doğrudan en alakalı sonuçları sunar.            </p>
            <h3 className='page-title'>Akıllı Öneriler Alın</h3>
            <ul>
              <li>Tinnten AI, aradığınız ürün veya hizmeti analiz eder ve:</li>
              <li>En alakalı firmaları ve ürünleri listeler,</li>
              <li>Filtreleme seçenekleri ile aramanızı daraltmanıza yardımcı olur,</li>
              <li>Benzer ve alternatif seçenekler sunarak en iyi tercihi yapmanızı sağlar.</li>
            </ul>
            <p>💡 Geleneksel listelerden farklı olarak, Tinnten kullanıcı deneyimi ve yapay zeka destekli bağlamsal analiz ile sizin için en iyi sonuçları sıralar.</p>
            <h3 className='page-title'>Firmalarla Hızlı Bağlantı Kurun</h3>
            <p>Doğrudan iletişim: Beğendiğiniz ürün veya hizmeti sunan firmalarla kolayca bağlantıya geçebilirsiniz.</p>
            <p>Teklif ve fiyat alabilirsiniz: Birden fazla firmaya aynı anda teklif gönderebilir, en uygun seçeneği değerlendirebilirsiniz.</p>

            <h3 className='page-title'>Akıllı Öğrenme ile Daha İyi Sonuçlar</h3>
            <p>Tinnten, kullanıcı tercihlerini ve arama geçmişini analiz ederek sonuçları sürekli olarak iyileştirir.</p>
            <p> Siz platformu kullandıkça, öneriler daha akıllı ve isabetli hale gelir.</p>

            <hr />

            <h3 className='page-title'>Neden Tinnten?</h3>
            <p>Doğal dil araması – Kategorilerde gezmeden, tam olarak ihtiyacınızı yazabilirsiniz.</p>
            <p>Yapay zeka destekli öneriler – En alakalı firma ve ürünleri anında bulun.</p>
            <p>Hızlı bağlantı – İlgili firmalarla anında iletişime geçin ve teklif alın.</p>
            <p>Akıllı öğrenme – Tercihlerinizden öğrenen kişiselleştirilmiş sonuçlar.</p>
          </div>
        </div>
      </div>
    </>
  )
}
