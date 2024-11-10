import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import { Spinner } from "react-bootstrap";
const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [t, i18n] = useTranslation("global")
    const [isLoading, setIsLoading] = useState(true)
    const [value, setValue] = useState({
        userLoggedIn: false, user: {}, isLoading: false,
        logout: () => {
            let _token = localStorage.getItem("token")
         
        }
    })

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}