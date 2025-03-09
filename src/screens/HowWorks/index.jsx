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
          <p>Nasıl Çalışır</p>
          <p>işte böyle çalışır</p>
        </div>
    </>
  )
}
