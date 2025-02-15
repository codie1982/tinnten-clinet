import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import MainLayout from "../layouts/Main";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../screens/Login"
import Register from "../screens/Register"
import Advertaise from "../components/Advertaise";
import { AuthProvider } from "../context/authContext";  // ✅ AuthProvider'ı ekleyin

const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <MainLayout />
        ),
        children: [
            { path: "/", element: <Advertaise /> },
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