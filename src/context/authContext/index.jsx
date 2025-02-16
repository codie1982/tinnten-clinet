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
    const { data, isError, isLoading: reduxLoading, isSuccess, isLogout } = useSelector((state) => state.auth);

    const [authState, setAuthState] = useState({
        isLogin: false,
        user: null,
        isLoading: true,
    });

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('access_token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (token && user) {
                setAuthState({ isLogin: true, user, isLoading: false });
            } else {
                setAuthState({ isLogin: false, user: null, isLoading: false });
            }
        };
        init();
    }, [dispatch]);

    useEffect(() => {
        console.log("data", data)
        if (!reduxLoading) {
            if (isError && authState.isLogin) {
                toast.error("Oturum süreniz doldu.");
                logout();
            }
            if (isSuccess && data) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.info));
                localStorage.setItem('profiles', JSON.stringify(data.profiles));
            }
            if (isSuccess) {
                const user = JSON.parse(localStorage.getItem('user')) || null;
                const profiles = JSON.parse(localStorage.getItem('profiles')) || null;
                setAuthState({ isLogin: true, user, profiles, isLoading: false });
            }


            if (isLogout) {
                localStorage.clear()
                setAuthState({ isLogin: false, user: null, isLoading: false });
                toast.info("Oturumunuz sonlandırıldı.");
            }
        }
    }, [isError, isLogout, reduxLoading, isSuccess, data]);

    const logout = () => {
        dispatch(logoutUser());
    };

    return (
        <AuthContext.Provider value={{ ...authState, logout }}>
            {children}
        </AuthContext.Provider>
    );
}