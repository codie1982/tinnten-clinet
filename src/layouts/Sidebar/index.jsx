import React from 'react'
import { Link } from "react-router-dom";
import logo_text_transparent from "../../assets/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHome,
    faUser,
    faCog,
    faFileAlt,
    faCalendar,
    faMessage,
    faQuestionCircle,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-image-container">
                <Link to={"/"} href="#"> <img className="logo" src={logo_text_transparent} /></Link>
            </div>
            <div className="sidebar-header">
                <div className="search-section mt-2">
                    <input type="text" className="seach-control" placeholder="Arama yapınız" />
                </div>
            </div>
            <div className="sidebar-content">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="#" className="nav-link">
                            <FontAwesomeIcon icon={faHome} />
                            <span className="ms-2">Ana Sayfa</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link">
                            <FontAwesomeIcon icon={faCog} />
                            <span className="ms-2">Ayarlar</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link">
                            <FontAwesomeIcon icon={faFileAlt} />
                            <span className="ms-2">Aramalar</span>
                        </a>
                        <div className="nav-sub-list">
                            <ul>
                                <li><div className="nav-sub-item"><Link to={"/search/1"}>Arama 1</Link></div></li>
                                <li><div className="nav-sub-item"><Link to={"/search/2"}>Arama 2</Link></div></li>
                                <li><div className="nav-sub-item"><Link to={"/search/3"}>Arama 3</Link> </div></li>
                            </ul>
                        </div>
                    </li>

                </ul>
            </div>
            <div class="sidebar-footer-menu">
                <ul>
                    {/* <li>
                        <a href="#link1">
                            <div className="profil-section">
                                <div className="profil-image">
                                    <img src={logo_text_transparent} />
                                </div>
                                <div className="profil-info">
                                    <div className="profil-name"><span>Engin EROL</span></div>
                                    <div className="profil-email"><span>enginerol@gmail.com</span></div>
                                </div>
                            </div>
                        </a>
                    </li> */}
                    <li>
                        <a href="#link1">
                            <div className="profil-section-make-account">
                                <div className="profil-button">
                                    <span>Firmanı ekle</span>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
