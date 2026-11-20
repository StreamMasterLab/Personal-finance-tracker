import { useEffect, useState } from "react"
import { request } from "../api"
import { formatDate } from "../utils"
import { useAuth } from "../context/AuthContext"

export default function Profile() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [createdAt, setCreatedAt] = useState("")
    const [alert, setAlert] = useState(null)
    const { updateUser } = useAuth()

    useEffect(() => {
        (async () => {
            const res = await request("get", "/auth/profile")
            if (res.status === 1) {
                setName(res.data.name)
                setEmail(res.data.email)
                setCreatedAt(formatDate(res.data.createdAt))
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await request("put", "/auth/profile-update", { name, email })
        if (res.status === 1) {
            setAlert({ type: "success", text: "Profile updated." })
            updateUser({ name, email })
        } else {
            setAlert({ type: "error", text: res.message })
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Profile</h1>
                <p>Your account details.</p>
            </div>

            {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

            <div className="card" style={{ maxWidth: 420 }}>
                <div className="card-title">Account information</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Full name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-row">
                        <label>Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-row">
                        <label>Member since</label>
                        <input type="text" className="form-control" value={createdAt} disabled />
                    </div>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                </form>
            </div>
        </>
    )
}
