import { useEffect, useState } from "react"
import { request } from "../api"
import { formatMoney, formatDate } from "../utils"

const emptyForm = { title: "", targetAmount: "", targetDate: "" }

export default function Goals() {
    const [goals, setGoals] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [contributions, setContributions] = useState({})
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    async function loadGoals() {
        const res = await request("get", "/goal/list")
        setGoals(res.status === 1 ? res.data : [])
        setLoaded(true)
    }

    useEffect(() => { loadGoals() }, [])

    async function contribute(id) {
        const amount = parseFloat(contributions[id])
        if (!amount || amount <= 0) return
        const res = await request("put", `/goal/update-progress/${id}`, { amount })
        if (res.status === 1) {
            setContributions({ ...contributions, [id]: "" })
            loadGoals()
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this goal?")) return
        const res = await request("delete", `/goal/delete/${id}`)
        if (res.status === 1) loadGoals()
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        const body = {
            title: form.title,
            targetAmount: parseFloat(form.targetAmount),
            targetDate: form.targetDate
        }
        const res = await request("post", "/goal/add", body)
        if (res.status === 1) {
            setForm(emptyForm)
            loadGoals()
        } else {
            setError(res.message)
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Goals & savings</h1>
                <p>What you're saving up for.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <div className="card-title">Add a savings goal</div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 14, alignItems: "end" }}>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Title</label>
                            <input type="text" className="form-control" placeholder="e.g. New laptop" value={form.title}
                                   onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Target amount (₹)</label>
                            <input type="number" step="0.01" className="form-control" value={form.targetAmount}
                                   onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
                        </div>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Target date</label>
                            <input type="date" className="form-control" value={form.targetDate}
                                   onChange={(e) => setForm({ ...form, targetDate: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Add goal</button>
                    </div>
                </form>
            </div>

            {loaded && goals.length === 0 && <div className="empty-state">No goals yet — add one above.</div>}

            {goals.map((g) => {
                const pct = Math.min(parseFloat(g.progress), 100)
                const daysLeft = Math.ceil((new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
                return (
                    <div className="card" key={g._id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <div>
                                <div className="card-title" style={{ marginBottom: 2 }}>{g.title}</div>
                                <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>
                                    Target: {formatDate(g.targetDate)} {daysLeft >= 0 ? `(${daysLeft} days left)` : "(past due)"}
                                </div>
                            </div>
                            <button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(g._id)}>Delete</button>
                        </div>
                        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                            <span>{formatMoney(g.savedAmount)} saved</span>
                            <span style={{ color: "var(--ink-soft)" }}>{g.progress} of {formatMoney(g.targetAmount)}</span>
                        </div>
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                            <input type="number" step="0.01" className="form-control" placeholder="Amount to add"
                                   style={{ maxWidth: 160 }} value={contributions[g._id] || ""}
                                   onChange={(e) => setContributions({ ...contributions, [g._id]: e.target.value })} />
                            <button className="btn btn-gold btn-sm" onClick={() => contribute(g._id)}>Add money</button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
