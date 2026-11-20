import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { request } from "../api"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSuccess("")
        const res = await request("post", "/auth/forgot-password", { email, newPassword })
        if (res.status === 1) {
            setSuccess("Password updated. Redirecting to login…")
            setTimeout(() => navigate("/login"), 900)
        } else {
            setError(res.message || "Could not reset password")
        }
    }

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <div className="auth-brand">Ledger<span>.</span></div>
                <div className="auth-sub">Reset your password</div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Account email</label>
                        <input type="email" className="form-control" value={email}
                               onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-row">
                        <label>New password</label>
                        <input type="password" className="form-control" value={newPassword} minLength={6}
                               onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Update password</button>
                </form>

                <div className="auth-switch">
                    <Link to="/login">Back to login</Link>
                </div>
            </div>
        </div>
    )
}
