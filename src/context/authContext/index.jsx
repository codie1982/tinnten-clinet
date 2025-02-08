import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { checkSession } from "../../features/auth/authSlicer"


const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        throw new Error("useAuth() must be used within an AuthProvider.");
    }
    return context;
}

export function AuthProvider({ children }) {

    const dispatch = useDispatch()
    const { data, isError, isLoading: reduxLoading, isSuccess } = useSelector((state) => state.auth);


    const [authState, setAuthState] = useState({
        isLogin: false,
        user: null,
        isLoading: true,
    });

    // ✅ Uygulama ilk yüklendiğinde session kontrolü yap
    useEffect(() => {
        checkTokenValidity();
    }, []);
    // ✅ Belirli aralıklarla session kontrolü (örn: 5 dakikada bir)
    useEffect(() => {
        const interval = setInterval(() => {
            checkTokenValidity();
        }, 5 * 60 * 1000); // 5 dakika

        return () => clearInterval(interval);
    }, []);
    // ✅ Token Süresi ve Session Kontrolü
    const checkTokenValidity = async () => {
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token) {
            const isValid = dispatch(checkSession()); // 🔒 API'ye session kontrolü yap

            if (isValid) {
                setAuthState({ isLogin: true, user, isLoading: false });
            } else {
                logout(); // ⛔ Token geçersizse çıkış yap
            }
        } else {
            setAuthState({ isLogin: false, user: null, isLoading: false });
        }
    };

    // ✅ Çıkış Yapma Fonksiyonu
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setAuthState({ isLogin: false, user: null, isLoading: false });
        toast.info("Oturumunuz sonlandırıldı.");
    };

    // ✅ Redux durumuna göre kontrol
    useEffect(() => {
        if (!reduxLoading) {
            if (isError) {
                toast.error(data);
                logout();
            } else if (isSuccess && data) {
                localStorage.setItem('access_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setAuthState({ isLogin: true, user: data.user, isLoading: false });
            }
        }
    }, [isError, reduxLoading, isSuccess, data]);

    return (
        <AuthContext.Provider value={{ ...authState, logout }}>
            {children}
        </AuthContext.Provider>
    );
}