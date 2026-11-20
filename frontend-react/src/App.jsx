import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AppLayout from "./components/AppLayout"
import AdminLayout from "./components/AdminLayout"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"

import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Categories from "./pages/Categories"
import Budget from "./pages/Budget"
import Goals from "./pages/Goals"
import Reports from "./pages/Reports"
import Notifications from "./pages/Notifications"
import Profile from "./pages/Profile"

import ClientsList from "./pages/admin/ClientsList"
import ClientDetail from "./pages/admin/ClientDetail"

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Client area */}
            <Route element={<ProtectedRoute role="client" />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/budget" element={<Budget />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Admin area */}
            <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<ClientsList />} />
                    <Route path="/admin/clients/:id" element={<ClientDetail />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
