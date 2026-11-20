import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { request } from "../../api"
import { formatMoney, formatDate } from "../../utils"

export default function ClientDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [error, setError] = useState("")

    async function load() {
        const res = await request("get", `/admin/clients/${id}`)
        if (res.status === 1) setData(res.data)
        else setError(res.message)
    }

    useEffect(() => { load() }, [id])

    async function handleDelete() {
        if (!confirm("Remove this client and all their data? This cannot be undone.")) return
        const res = await request("delete", `/admin/clients/${id}`)
        if (res.status === 1) navigate("/admin")
        else setError(res.message)
    }

    if (error) {
        return (
            <>
                <div className="alert alert-error">{error}</div>
                <Link to="/admin" className="btn btn-outline">← Back to clients</Link>
            </>
        )
    }
    if (!data) return <div className="empty-state">Loading…</div>

    return (
        <>
            <div className="page-header">
                <h1>{data.client.name}</h1>
                <p>{data.client.email} · Joined {formatDate(data.client.createdAt)}</p>
            </div>

            <div className="stat-grid">
                <div className="stat-card income">
                    <div className="stat-label">Total income</div>
                    <div className="stat-value">{formatMoney(data.totalIncome)}</div>
                </div>
                <div className="stat-card expense">
                    <div className="stat-label">Total expense</div>
                    <div className="stat-value">{formatMoney(data.totalExpense)}</div>
                </div>
                <div className="stat-card gold">
                    <div className="stat-label">Balance</div>
                    <div className="stat-value">{formatMoney(data.balance)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Transactions logged</div>
                    <div className="stat-value">{data.transactionCount}</div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <Link to="/admin" className="btn btn-outline">← Back to clients</Link>
                <button className="btn btn-danger-outline" onClick={handleDelete}>Remove this client</button>
            </div>
        </>
    )
}
