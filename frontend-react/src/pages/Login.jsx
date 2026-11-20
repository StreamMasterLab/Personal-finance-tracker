import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { request } from "../api"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        const res = await request("post", "/auth/login", { email, password })
        if (res.status === 1) {
            login(res.token, res.data)
            navigate(res.data.role === "admin" ? "/admin" : "/dashboard")
        } else {
            setError(res.message || "Login failed")
        }
    }

    return (
        <div className="auth-split">
            <div className="auth-left">
                <div className="brand">Ledger<span>.</span></div>
                <div className="tagline">Your money,<br />finally organized.</div>
                <ul>
                    <li>✓ Track income & expenses in one place</li>
                    <li>✓ Set monthly budgets with alerts</li>
                    <li>✓ Watch savings goals fill up</li>
                    <li>✓ Download a clean PDF report anytime</li>
                </ul>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2 style={{ fontFamily: "var(--font-head)", marginBottom: 4 }}>Welcome back</h2>
                    <div className="auth-sub">Log in to your account</div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-row">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Log in</button>
                    </form>

                    <div className="auth-switch">
                        New here? <Link to="/register">Create an account</Link><br />
                        <Link to="/forgot-password">Forgot password?</Link><br />
                        <Link to="/">← Back to home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
