import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Pass role="client" or role="admin" to restrict a branch of routes to that role.
// Logged in but wrong role -> sent to their own home area, not to login.
export default function ProtectedRoute({ role }) {
    const { token, user } = useAuth()
    if (!token) return <Navigate to="/login" replace />
    if (role && user?.role !== role) {
        return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />
    }
    return <Outlet />
}
