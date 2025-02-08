import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import MainLayout from "../layouts/Main";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../screens/Login"
import Register from "../screens/Register"
import Advertaise from "../components/Advertaise";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Advertaise /> },

            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/conversition", element: <Home /> },
                    { path: "/profile", element: "Profile" },
                    { path: "/dashboard", element: "DashBoard" },
                    { path: "/add", element: "Firmanı Ekle" },
                    { path: "/pricing", element: "Firmanı Ekle" }

                ]
            }
        ]
    },
    {
        element: <AuthLayout />,  // ✅ AuthLayout da artık AuthProvider ile çalışır
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/policies/terms-of-use/", element: "policies/terms-of-use/" },
            { path: "/policies/privacy-policy/", element: "policies/privacy-policy/" },
        ]
    },
])

export default routes;