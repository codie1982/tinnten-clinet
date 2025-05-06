import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import Profile from "../screens/Profile"
import CompanyProfile from "../screens/CompanyProfile"
import OurOffer from "../screens/OurOffer";
import MainLayout from "../layouts/Main";
import AILayout from "../layouts/AILayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../screens/Login"
import Register from "../screens/Register"
import Advertaise from "../components/Advertaise";
import { AuthProvider } from "../context/authContext";  // ✅ AuthProvider'ı ekleyin
import WaitList from "screens/WaitList";
import Abouth from "screens/Abouth";
import HowWorks from "screens/HowWorks";
import ConsumerTerms from "screens/ConsumerTerms";
import PrivatePolicy from "screens/PrivatePolicy";
import Contact from "screens/Contact";
import GoogleAuth from "screens/GoogleAuth";
import React, { useEffect } from "react";



// İndirme işlemini yapan bileşen
const DownloadTxt = () => {
    useEffect(() => {
        const link = document.createElement("a");
        // Public klasöründe bulunan dosyanın yolunu belirtiyoruz
        link.href = "/loaderio-7685311382253a34a6fb6901560ffa03.txt";
        link.download = "loaderio-7685311382253a34a6fb6901560ffa03";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);
    return <div>Dosya indiriliyor...</div>;
};

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Advertaise /> },
            { path: "/abouth", element: <Abouth /> },
            { path: "/works", element: <HowWorks /> },
            { path: "/consumer-terms", element: <ConsumerTerms /> },
            { path: "/privatepolicy", element: <PrivatePolicy /> },
            { path: "/contact", element: <Contact /> },
            { path: "/google-auth", element: <GoogleAuth /> },
            { path: "*", element: <h1>404 - Sayfa Bulunamadı</h1> },
        ],
    },
    {
        path: "/",
        element: <AILayout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "ouroffer", element: <OurOffer /> },
                    { path: "profile", element: <Profile /> },
                    { path: "companyprofile", element: <CompanyProfile /> },
                    { path: "conversation", element: <Home /> },
                    { path: "conversation/:id", element: <Home /> },
                    { path: "*", element: <h1>404 - Sayfa Bulunamadı</h1> },
                ],
            },
        ]
    },
    {
        path: "/loaderio-7685311382253a34a6fb6901560ffa03",
        element: <DownloadTxt />,
    },
    {
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ],
    },
]);


export default routes;

// { path: "/waitlist", element: <WaitList /> },