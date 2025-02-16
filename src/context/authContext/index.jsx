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
        isLogout,
        isValid
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

        const interval = setInterval(async () => {
            await checkTokenValidity();
        }, 5 * 60 * 1000);
        return () => clearInterval(interval); // Temizlik önemli
    }, []);

    useEffect(() => {
        console.log("reduxLoading, isSuccess, isValid", reduxLoading, isSuccess, isValid)
        if (!reduxLoading)
            if (isSuccess)
                if (!isValid) {
                    console.log("DENEME4")
                    logout()
                } else {
                    console.log("DENEME5")
                    const user = JSON.parse(localStorage.getItem('user')) || null;
                    setAuthState({ isLogin: true, user, isLoading: false });
                }
    }, [reduxLoading, isSuccess, isValid])

    // ✅ Token Süresi ve Session Kontrolü
    const checkTokenValidity = async () => {
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("user", user)
        if (user) {
            if (token) {
                console.log("DENEME1")
                dispatch(checkToken()); // 🔒 API'ye session kontrolü yap
            } else {
                console.log("DENEME2")
                setAuthState((prev) => ({
                    ...prev,
                    isLogin: false,
                    user: null,
                    isLoading: false,  // ✅ Token yoksa da loading false
                }));
            }
        } else {
            toast.error("Oturumunuz sonlandırıldı.");
            console.log("DENEME3")
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
                console.log("DENEME8")
                toast.error(data);
                logout();
            }

            if (isSuccess && data && !authState.isLogin) {  // ✅ Zaten login ise tekrar set etme
                console.log("DENEME7")
                console.log("data", data)
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.info));
                localStorage.setItem('profiles', JSON.stringify(data.profiles));
                setAuthState({ isLogin: true, user: data.user, isLoading: false });
            }

            if (isLogout && authState.isLogin) {  // ✅ Zaten logout ise tekrar çalıştırma
                console.log("DENEME6")
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                localStorage.removeItem('profiles');
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