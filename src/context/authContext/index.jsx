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
    const { data, sendCode, isError, isLoading: reduxLoading, isSuccess, isLogout } = useSelector((state) => state.auth);

    const [authState, setAuthState] = useState({
        isLogin: false,
        user: null,
        isLoading: true,
    });

    useEffect(() => {
        const init = async () => {

            const token = localStorage.getItem('access_token');
            const user = JSON.parse(localStorage.getItem('user'));
            const profiles = JSON.parse(localStorage.getItem('profiles'));
            if (token && user) {
                setAuthState({ isLogin: user.email_verified ? true : false, user, profiles, sendCode, isLoading: false });
            } else {
                setAuthState({ isLogin: false, user: null, profiles: null, sendCode, isLoading: false });
            }
        };
        init();
    }, [dispatch]);

    useEffect(() => {
        if (!reduxLoading) {
            if (isError && authState.isLogin) {
                toast.error("Oturum süreniz doldu.");
                logout();
            }
            if (isSuccess && data) {
                toast.success(data.message)
                console.log("data:", data);
                localStorage.setItem('access_token', data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.data.info));
                localStorage.setItem('profiles', JSON.stringify(data.data.profiles));

                const user = data.data.info || null;
                const profiles = data.data.profiles || null;

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