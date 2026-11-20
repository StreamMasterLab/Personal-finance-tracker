import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AdminLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/login")
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    Ledger<span>.</span>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", opacity: 0.65, marginTop: 4 }}>ADMIN PANEL</div>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>Clients</NavLink>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    Log out{user ? ` (${user.name.split(" ")[0]})` : ""}
                </button>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
