import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/transactions", label: "Transactions" },
    { to: "/categories", label: "Categories" },
    { to: "/budget", label: "Budget" },
    { to: "/goals", label: "Goals & Savings" },
    { to: "/reports", label: "Reports" },
    { to: "/notifications", label: "Notifications" },
    { to: "/profile", label: "Profile" }
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/login")
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">Ledger<span>.</span></div>
            <nav className="sidebar-nav">
                {links.map((l) => (
                    <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
                        {l.label}
                    </NavLink>
                ))}
            </nav>
            <button className="logout-btn" onClick={handleLogout}>
                Log out{user ? ` (${user.name.split(" ")[0]})` : ""}
            </button>
        </aside>
    )
}
