import { useState, useEffect, useCallback } from "react";
import Logger from "../utils/Logger";

const initialModals = {
  login: false,
  signup: false,
  logout: false,
  forgotPassword: false,
  deleteallchats: false,
  contactus: false,
  settings: false,
  profil: false,
  waitlist: false,
};

export function useModalManager() {
  const [modals, setModals] = useState(initialModals);
  const log = new Logger("ModalManager");

  const openModal = useCallback((modalName) => {
    log.log("openModal çağrıldı:", modalName);
    setModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName) => {
    log.log("closeModal çağrıldı:", modalName);
    setModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const toggleModal = useCallback((modalName) => {
    log.log("toggleModal çağrıldı:", modalName);
    setModals((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  }, []);

  const isOpen = useCallback((modalName) => {
    const state = modals[modalName] || false;
    return state;
  }, [modals]);

  const closeAllModals = useCallback(() => {
    log.log("closeAllModals çağrıldı");
    setModals(
      Object.keys(initialModals).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
    );
  }, []);

  return {
    openModal,
    closeModal,
    toggleModal,
    isOpen,
    closeAllModals,
    modals,
  };
}