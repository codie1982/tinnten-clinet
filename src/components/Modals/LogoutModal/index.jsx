import React, { useState, useEffect } from 'react'
import { Modal, Button,Spinner } from 'react-bootstrap'
import { useAuth } from '../../../context/authContext'
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../ModalProvider'
import { logoutUser,axiosTest } from '../../../api/auth/authSlicer'
import { toast } from 'react-toastify';

export default function LogoutModal({ setOpenModal }) {
    const dispatch = useDispatch();
    const { closeModal, isOpen, closeAllModals } = useModal();
    const { setAuthState,logoutApplication } = useAuth();
    const { isLoading, isSuccess,isLogout, isError } = useSelector((state) => state.auth);

    const handleLogout = () => {
       logoutApplication();
       toast.success("Oturumunuz sonlandırıldı!");
       //localStorage.clear();
       //window.location.href = '/';
    };

    useEffect(() => {
        if (isSuccess && !isError && isLogout) {
            setAuthState({ isLogin: false, user: null, isLoading: false });
            localStorage.clear();
            toast.success("Oturumunuz sonlandırıldı!");
            closeAllModals();
        }
    }, [isSuccess, isError,isLogout]);

    return (
        <Modal
            size="md"
            show={isOpen("logout")}
            onHide={() => closeModal("logout")}
            aria-labelledby="modal-logout"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="modal-logout">Çıkış Yap</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Çıkış yapmak istediğinize emin misiniz?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => closeModal("logout")}>
                    Vazgeç
                </Button>
                <Button
                    variant="danger"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Çıkış yapılıyor...
                        </>
                    ) : (
                        "Çıkış Yap"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}