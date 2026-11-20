import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { request } from "../api"

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSuccess("")
        const res = await request("post", "/auth/register", { name, email, password })
        if (res.status === 1) {
            setSuccess("Account created. Redirecting to login…")
            setTimeout(() => navigate("/login"), 900)
        } else {
            setError(res.message || "Registration failed")
        }
    }

    return (
        <div className="auth-split">
            <div className="auth-left">
                <div className="brand">Ledger<span>.</span></div>
                <div className="tagline">Start tracking<br />in two minutes.</div>
                <ul>
                    <li>✓ Free — no card required</li>
                    <li>✓ Your data stays private to your account</li>
                    <li>✓ Works on desktop and mobile</li>
                    <li>✓ Set up your first budget today</li>
                </ul>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2 style={{ fontFamily: "var(--font-head)", marginBottom: 4 }}>Create your account</h2>
                    <div className="auth-sub">Takes less than a minute</div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label>Full name</label>
                            <input type="text" className="form-control" value={name}
                                   onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-row">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} minLength={6}
                                   onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Create account</button>
                    </form>

                    <div className="auth-switch">
                        Already have an account? <Link to="/login">Log in</Link><br />
                        <Link to="/">← Back to home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
