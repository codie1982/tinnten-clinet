import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { Container, Navbar, Nav, Dropdown, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelopeSquare, faGear, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons';
import tinntenLogo from "../../assets/char-logo.png"
import { useSelector, useDispatch } from "react-redux"
import HeaderMenu from '../../components/HeaderMenu';
import ProfilComponent from '../../components/Modals/ProfilModal';
import SettingsComponent from '../../components/Modals/SettingsModal';
import ContactUsComponent from '../../components/Modals/ContactUsModal';
import DeleteAllChatsComponent from '../../components/Modals/AllDeleteModal';
import LogoutComponent from '../../components/Modals/LogoutModal';
import { useAuth } from 'context/authContext';
import { getUserProfile } from "../../api/profile/profileSlicer"

export default function Header({ toggleSidebar }) {
  const dispatch = useDispatch()
  const { isLogin, isLoading, user } = useAuth()
  const [t, i18n] = useTranslation("global")
  const [isOpenProfil, setIsOpenProfil] = useState(false)
  const [isOpenSettings, setIsOpenSettings] = useState(false)
  const [isOpenDeleteAllChats, setIsOpenDeleteAllChats] = useState(false)
  const [isOpenContactUs, setIsOpenContactUs] = useState(false)

  const [isOpenLogout, setIsOpenLogout] = useState(false)
  const [isContactUs, setIsContactUs] = useState(false)
  const [isLogOut, setIsLogOut] = useState(false)
  const [userprofile, setuserprofile] = useState()


  const { isLoading: isProfileLoading, isSuccess, isError, userProfile, message } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!isLoading) {
      if (isLogin) {
        if (user != null && user.email_verified) {
          dispatch(getUserProfile())
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!isProfileLoading && isSuccess && userProfile) {
      console.log("userProfile:", isProfileLoading , isSuccess , userProfile);
      setuserprofile(userProfile)
    }

  }, [isProfileLoading, isSuccess, isError, userProfile, message])



  const openProfil = () => {
    setIsOpenProfil(!isOpenProfil)
  }
  const openSettings = () => {
    setIsOpenSettings(!isOpenSettings)
  }
  const openDeleteAll = () => {
    setIsOpenDeleteAllChats(!isOpenDeleteAllChats)
  }
  const openContactUs = () => {
    setIsOpenContactUs(!isOpenContactUs)
  }
  const openLogout = () => {
    setIsOpenLogout(!isOpenLogout)
  }

  return (
    <div className="chat-header">
      <div className="chat-header-block">
        <Navbar bg="dark" variant="dark" expand="lg" className="w-100">
          <Container fluid>
            <Navbar.Brand id="toggleButton" onClick={toggleSidebar} href="#">
              <FontAwesomeIcon icon={faBars} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav">
              <Nav className="">
                <Nav.Link href="#" className="active" aria-current="page">{t("header.main")}</Nav.Link>
              </Nav>
              <Nav className="ms-auto d-flex">
                <Nav.Item>
                  <Nav.Link className="dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <HeaderMenu openLogout={openLogout} openContactUs={openContactUs} openDeleteAll={openDeleteAll} openSettings={openSettings} openProfil={openProfil} userprofile={userprofile} />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <ProfilComponent isOpen={isOpenProfil} setOpenModal={openProfil} userProfile={userprofile} />
      <SettingsComponent isOpen={isOpenSettings} setOpenModal={openSettings} />
      <DeleteAllChatsComponent isOpen={isOpenDeleteAllChats} setOpenModal={openDeleteAll} />
      <ContactUsComponent isOpen={isOpenContactUs} setOpenModal={openContactUs} />
      <LogoutComponent isOpen={isOpenLogout} setOpenModal={openLogout} />
    </div>
  )
}


{/*    <Dropdown align={'end'}>
                     
                      <Dropdown.Toggle as={CustomToggle} id={`dropdown-custom-components`} />
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="1" onClick={openProfil}>{user.name}</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={openSettings}><FontAwesomeIcon icon={faGear} /> {t("header.menu.settings")}</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onClick={openDeleteAll}><FontAwesomeIcon icon={faTrash} /> {t("header.menu.deleteallconversation")}</Dropdown.Item>
                        <Dropdown.Item eventKey="4" onClick={openContactUs}><FontAwesomeIcon icon={faEnvelopeSquare} /> {t("header.menu.contact")}</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="5" onClick={openLogout}><FontAwesomeIcon icon={faSignOut} /> {t("header.logout")}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}