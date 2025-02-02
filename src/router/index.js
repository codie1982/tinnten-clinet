import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import { MainLayout } from "../layouts/Main";
const routes =  createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        errorElement : "Home Error Page",
        children:[
            {
                path:"/",
                index:true,
                element:<Home/>
            },
            {
                path:"about",
                index:true,
                element:"Hakkımızda"
            },
           
        ]
    }
])

export default routes;