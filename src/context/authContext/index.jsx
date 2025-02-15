import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { checkToken, logoutUser } from "../../api/auth/authSlicer"

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
    const {
        data,
        isError,
        isLoading: reduxLoading,
        isSuccess,
        isLogout
    } = useSelector((state) => state.auth);



    const [authState, setAuthState] = useState({
        isLogin: false,
        user: null,
        isLoading: true,
    });

    useEffect(() => {
        const init = async () => {
            await checkTokenValidity();
        };
        init();

        const interval = setInterval(() => {
            checkTokenValidity();
        }, 5 * 60 * 1000);
        return () => clearInterval(interval); // Temizlik önemli
    }, []);
    // ✅ Token Süresi ve Session Kontrolü
    const checkTokenValidity = async () => {
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user')) || null;

        console.log("user", user)
        if (user) {
            if (token) {
                const isValid = dispatch(checkToken()); // 🔒 API'ye session kontrolü yap
                if (isValid) {
                    setAuthState({ isLogin: true, user, isLoading: false });
                } else {
                    logout(); // ⛔ Token geçersizse çıkış yap
                }
            } else {
                setAuthState((prev) => ({
                    ...prev,
                    isLogin: false,
                    user: null,
                    isLoading: false,  // ✅ Token yoksa da loading false
                }));
            }
        } else {
            setAuthState((prev) => ({
                ...prev,
                isLogin: false,
                user: null,
                isLoading: false,  // ✅ Token yoksa da loading false
            }));
        }

    };

    // ✅ Çıkış Yapma Fonksiyonu
    const logout = () => {
        dispatch(logoutUser()); // 🔒 API'ye session kontrolü yap
    };

    useEffect(() => {
        if (!reduxLoading) {
            if (isError && authState.isLogin) {  // ✅ Sadece login ise çalıştır
                toast.error(data);
                logout();
            }

            if (isSuccess && data && !authState.isLogin) {  // ✅ Zaten login ise tekrar set etme
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.info));
                localStorage.setItem('profile', JSON.stringify(data.profile));
                setAuthState({ isLogin: true, user: data.user, isLoading: false });
            }

            if (isLogout && authState.isLogin) {  // ✅ Zaten logout ise tekrar çalıştırma
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                localStorage.removeItem('proifle');
                setAuthState({ isLogin: false, user: null, isLoading: false });
                toast.info("Oturumunuz sonlandırıldı.");
            }
        }
    }, [isError, isLogout, reduxLoading, isSuccess, data]);

    return (
        <AuthContext.Provider value={{ ...authState, logout }}>
            {children}
        </AuthContext.Provider>
    );
}