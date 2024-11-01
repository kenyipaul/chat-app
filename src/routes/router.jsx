import { createBrowserRouter } from "react-router-dom"
import Login from "../views/login"
import Signup from "../views/signup"
import Chat from "../views/chat"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/register",
        element: <Signup />
    },
    {
        path: "/chat",
        element: <Chat />
    }
])