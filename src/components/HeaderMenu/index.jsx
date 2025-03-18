import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useAuth } from '../../context/authContext';
import tinntenLogo from "../../assets/char-logo.png"
import { useTranslation } from "react-i18next"

export default function ProfileMenu() {
    const [t, i18n] = useTranslation("global")
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const menuContainer = useRef(document.createElement("div"));
    const { isLogin, profiles, user } = useAuth()

    useEffect(() => {
        document.body.appendChild(menuContainer.current);
        return () => {
            document.body.removeChild(menuContainer.current);
        };
    }, []);

    // Dışarı tıklanınca menüyü kapatma
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-menu-container" ref={menuRef}>
            {/* Profil Resmi */}

            <img
                src={profiles?.profileImage ? profiles?.profileImage.path : tinntenLogo}
                alt="Profile"
                className="profile-image"
                onClick={() => setIsOpen(!isOpen)}
            />

            {/* Açılır Menü */}
            {isOpen && createPortal(
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="menu-popup"
                    style={{
                        position: "absolute",
                        top: menuRef.current?.getBoundingClientRect().bottom + "px",
                        left: menuRef.current?.getBoundingClientRect().left - 80 + "px"
                    }}
                >
                    <ul>
                        <li className="menu-item">{user.name}</li>
                        <li className="menu-item">{t("header.menu.settings")}</li>
                        <li className="menu-item">{t("header.menu.deleteallconversation")}</li>
                        <li className="menu-item">{t("header.menu.contact")}</li>
                        <li className="menu-item logout">{t("header.logout")}</li>
                    </ul>
                </motion.div>,
                menuContainer.current
            )}
        </div>
    );
}