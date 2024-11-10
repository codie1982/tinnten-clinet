import React from 'react'
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
import logo_text_transparent from "../../assets/text-logo-transparant.png"
export default function Header() {
  const [t, i18n] = useTranslation("global")
  return (
    <nav className="navbar navbar-expand-lg">
      <div>
      <Link to={"/"} className="navbar-brand" href="#"><img className="logo" src={logo_text_transparent} /></Link>
      </div>
      <div className="container">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item" />
            <li className="nav-item" />
          </ul>
        </div>
      </div>
    </nav>
  )
}