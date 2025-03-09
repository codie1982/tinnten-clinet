import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import MainLayout from "../layouts/Main";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../screens/Login"
import Register from "../screens/Register"
import Advertaise from "../components/Advertaise";
import { AuthProvider } from "../context/authContext";  // ✅ AuthProvider'ı ekleyin
import Abouth from "screens/Abouth";
import HowWorks from "screens/HowWorks";
import ConsumerTerms from "screens/ConsumerTerms";
import PrivatePolicy from "screens/PrivatePolicy";
import Contact from "screens/Contact";

const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <MainLayout />
        ),
        children: [
            { path: "/", element: <Advertaise /> },
            { path: "/abouth", element: <Abouth /> },
            { path: "/works", element: <HowWorks /> },
            { path: "/consumer-terms", element: <ConsumerTerms /> },
            { path: "/privatepolicy", element: <PrivatePolicy /> },
            { path: "/contact", element: <Contact/> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "conversation", element: <Home /> },
                    { path: "conversation/:id", element: <Home /> },
                ],
            },
            { path: "*", element: <h1>404 - Sayfa Bulunamadı</h1> },
        ],
    },
    {
        element: (
            <AuthLayout />
        ),
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ],
    },
])

export default routes;