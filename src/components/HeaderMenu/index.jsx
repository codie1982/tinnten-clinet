import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useAuth } from '../../context/authContext';
import tinntenLogo from "../../assets/char-logo.png"
import { useTranslation } from "react-i18next"
import LazyImage from '../Common/LazyImage'
import { Image, Spinner } from 'react-bootstrap'
import  { useModalManager }  from "../../hooks/useModalManager";
import  { useModal }  from "../Modals/ModalProvider";
export default function HeaderMenu({ openProfil, openSettings, openDeleteAll, openContactUs, userprofile, isProfileLoading }) {
    const [t, i18n] = useTranslation("global")
    const { openModal } = useModal()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const popupRef = useRef(null);
    const menuContainer = useRef(document.createElement("div"));
    const { isLogin, user } = useAuth()


    useEffect(() => {
        document.body.appendChild(menuContainer.current);
        return () => {
            document.body.removeChild(menuContainer.current);
        };
    }, []);

    // Dışarı tıklanınca menüyü kapatma: menuRef ve popupRef kontrol ediliyor
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-menu-container" ref={menuRef}>
            {isProfileLoading ?
                <Spinner animation="border" />
                :
                <Image
                    loading="lazy"
                    roundedCircle
                    src={userprofile?.profileImage.path ? userprofile.profileImage.path : tinntenLogo}
                    alt="Profile"
                    height={40}
                    width={40}
                    className="profile-image"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                />}

            {/* Açılır Menü */}
            {isMenuOpen && createPortal(
                <motion.div
                    ref={popupRef} // popupRef'i motion.div'e ekledim
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="menu-popup"
                    style={{
                        position: "absolute",
                        width: "200px",
                        top: menuRef.current?.getBoundingClientRect().bottom + "px",
                        left: menuRef.current?.getBoundingClientRect().left - 150 + "px"
                    }}
                >
                    <ul>
                        <li className="menu-item" onClick={()=>{openModal("profil")}} >{user.name}</li>
                        <li className="menu-item" onClick={()=>{openModal("settings")}}>{t("header.menu.settings")}</li>
                        <li className="menu-item" onClick={()=>{openModal("deleteallchats")}}>{t("header.menu.deleteallconversation")}</li>
                        <li className="menu-item" onClick={()=>{openModal("contactus")}}>{t("header.menu.contact")}</li>
                        <li className="menu-item logout" onClick={() => { 
                            console.log("onClick logout");
                            openModal("logout");
                        }}>{t("header.logout")}</li>
                    </ul>
                </motion.div>,
                menuContainer.current
            )}
        </div>
    );
}