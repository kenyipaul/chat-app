import "./sass/main.scss"
import React, { useEffect, useState } from "react"
import { router } from "./routes/router"
import { RouterProvider } from "react-router-dom"

export const UserContext = React.createContext();

export default function App() {
    
    const [user, setUser] = useState({
        // id: null,
        // name: null,
        // email: null,
    })

    useEffect(() => {
        let user = localStorage.getItem("_user")

        if (user !== null) {
            user = JSON.parse(user)
            setUser(user)
        }
    }, [])
    
    return (
        <div id="app">
            <UserContext.Provider value={[user, setUser]}>
                <RouterProvider router={router} />
            </UserContext.Provider>
        </div>
    )
}