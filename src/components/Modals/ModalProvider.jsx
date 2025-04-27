import React, { createContext, useContext, useEffect, useState } from "react";
import  { useModalManager }  from "../../hooks/useModalManager"
const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalManager = useModalManager(); // bizim hook
  return (
    <ModalContext.Provider value={modalManager}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}