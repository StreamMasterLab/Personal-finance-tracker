import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(localStorage.getItem("pft_token"))
    const [user, setUserState] = useState(() => {
        const u = localStorage.getItem("pft_user")
        return u ? JSON.parse(u) : null
    })

    function login(newToken, newUser) {
        localStorage.setItem("pft_token", newToken)
        localStorage.setItem("pft_user", JSON.stringify(newUser))
        setTokenState(newToken)
        setUserState(newUser)
    }

    function logout() {
        localStorage.removeItem("pft_token")
        localStorage.removeItem("pft_user")
        setTokenState(null)
        setUserState(null)
    }

    function updateUser(patch) {
        setUserState((prev) => {
            const updated = { ...prev, ...patch }
            localStorage.setItem("pft_user", JSON.stringify(updated))
            return updated
        })
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
