import { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useAgentSocket from "./useAgentSocket";

const initialModals = {
  login: false,
  signup: false,
  logout: false,
  forgotPassword: false,
};

export function useModalManager() {
  const [modals, setModals] = useState(initialModals);

  const openModal = useCallback((modalName) => {
    console.log("[useModalManager] openModal çağrıldı:", modalName);
    setModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName) => {
    console.log("[useModalManager] closeModal çağrıldı:", modalName);
    setModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const toggleModal = useCallback((modalName) => {
    console.log("[useModalManager] toggleModal çağrıldı:", modalName);
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
    console.log("[useModalManager] closeAllModals çağrıldı.");
    setModals(Object.keys(initialModals).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {}));
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