import React, { useState } from 'react'
import { useTranslation } from "react-i18next"
import { Container, Navbar, Nav, Dropdown, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelopeSquare, faGear, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons';
import profilImage from "../../assets/profilImage.jpg"
import ProfilComponent from '../../components/Modals/ProfilModal';
import SettingsComponent from '../../components/Modals/SettingsModal';
import ContactUsComponent from '../../components/Modals/ContactUsModal';
import DeleteAllChatsComponent from '../../components/Modals/AllDeleteModal';
import LogoutComponent from '../../components/Modals/LogoutModal';
export default function Header() {
  const [t, i18n] = useTranslation("global")
  const [isOpenProfil, setIsOpenProfil] = useState(false)
  const [isOpenSettings, setIsOpenSettings] = useState(false)
  const [isOpenDeleteAllChats, setIsOpenDeleteAllChats] = useState(false)
  const [isOpenContactUs, setIsOpenContactUs] = useState(false)

  const [isOpenLogout, setIsOpenLogout] = useState(false)
  const [isContactUs, setIsContactUs] = useState(false)
  const [isLogOut, setIsLogOut] = useState(false)

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
  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <img src={profilImage} alt="Kullanıcı Avatarı" className="rounded-circle" onClick={onClick} style={{ width: '30px', height: '30px' }} />

  ));
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );
  return (
    <div className="chat-header">
      <div className="chat-header-block">
        <Navbar bg="dark" variant="dark" expand="lg" className="w-100">
          <Container fluid>
            <Navbar.Brand id="toggleButton" /* onClick={toggleSidebar} */ href="#">
              <FontAwesomeIcon icon={faBars} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav">
              <Nav className="">
                <Nav.Link href="#" className="active" aria-current="page">Ana Sayfa</Nav.Link>
                <Nav.Link href="#">Hakkında</Nav.Link>
              </Nav>
              <Nav className="ms-auto d-flex">
                <Nav.Item>
                  <Nav.Link className="dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Dropdown align={'end'}>
                      <Dropdown.Toggle as={CustomToggle} id={`dropdown-custom-components`} />
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="1" onClick={openProfil}>Engin EROL</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={openSettings}><FontAwesomeIcon icon={faGear} /> Ayarlar</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onClick={openDeleteAll}><FontAwesomeIcon icon={faTrash} /> Tüm Konuşmaları sil</Dropdown.Item>
                        <Dropdown.Item eventKey="4" onClick={openContactUs}><FontAwesomeIcon icon={faEnvelopeSquare} /> Bizimle iletişime geçin</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="5" onClick={openLogout}><FontAwesomeIcon icon={faSignOut} /> Çıkış</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <ProfilComponent isOpen={isOpenProfil} setOpenModal={openProfil} />
      <SettingsComponent isOpen={isOpenSettings} setOpenModal={openSettings} />
      <DeleteAllChatsComponent isOpen={isOpenDeleteAllChats} setOpenModal={openDeleteAll} />
      <ContactUsComponent isOpen={isOpenContactUs} setOpenModal={openContactUs} />
      <LogoutComponent isOpen={isOpenLogout} setOpenModal={openLogout} />
    </div>
  )
}