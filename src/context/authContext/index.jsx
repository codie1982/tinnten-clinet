import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [t, i18n] = useTranslation("global")
    const [isLoading, setIsLoading] = useState(true)

    const { data } = useSelector(
        (state) => {
            return state.auth
        }
    )
    
    useEffect(() => {
        if (data) {
            setAuthState({
                isLogin: true,
                user: data, // Burada backend’den gelen user bilgisini ekleyebilirsin.
            });
        } else {
            setAuthState({
                isLogin: true,
                user: null,
            });
        }
    }, [data])
    // 4️⃣ State Tanımlamaları
    const [authState, setAuthState] = useState({
        isLogin: false,  // Kullanıcının login olup olmadığını takip eder
        user: null,      // Kullanıcı bilgisi (ilerde profil vs. ekleyebilirsin)
    });


    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    )
}