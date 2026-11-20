import { useEffect, useState } from "react"
import { request } from "../api"
import { formatMoney } from "../utils"

const now = new Date()

export default function Budget() {
    const [categories, setCategories] = useState([])
    const [budgets, setBudgets] = useState([])
    const [remaining, setRemaining] = useState(null)
    const [remainingMsg, setRemainingMsg] = useState("Set a budget above, then check remaining amounts here.")
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const [form, setForm] = useState({
        categoryId: "",
        monthlyLimit: "",
        month: now.getMonth() + 1,
        year: now.getFullYear()
    })
    const [checkMonth, setCheckMonth] = useState(now.getMonth() + 1)
    const [checkYear, setCheckYear] = useState(now.getFullYear())

    async function loadCategories() {
        const res = await request("get", "/category/list")
        if (res.status === 1) setCategories(res.data)
    }

    async function loadBudgets() {
        const res = await request("get", "/budget/list")
        setBudgets(res.status === 1 ? res.data : [])
        setLoaded(true)
    }

    useEffect(() => {
        loadCategories()
        loadBudgets()
    }, [])

    async function handleDelete(id) {
        if (!confirm("Delete this budget?")) return
        const res = await request("delete", `/budget/delete/${id}`)
        if (res.status === 1) loadBudgets()
    }

    async function checkRemaining() {
        const res = await request("get", `/budget/remaining?month=${checkMonth}&year=${checkYear}`)
        if (res.status === 1) {
            setRemaining(res.data)
        } else {
            setRemaining([])
            setRemainingMsg(res.message || "No budgets found for that month.")
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        const body = {
            categoryId: form.categoryId,
            monthlyLimit: parseFloat(form.monthlyLimit),
            month: parseInt(form.month),
            year: parseInt(form.year)
        }
        const res = await request("post", "/budget/set", body)
        if (res.status === 1) {
            setForm({ ...form, monthlyLimit: "" })
            loadBudgets()
        } else {
            setError(res.message)
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Budget management</h1>
                <p>Set limits per category and track what's left.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <div className="card-title">Set a monthly budget</div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 14, alignItems: "end" }}>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Category</label>
                            <select className="form-control" value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                                <option value="">Select category</option>
                                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Monthly limit (₹)</label>
                            <input type="number" step="0.01" className="form-control" value={form.monthlyLimit}
                                   onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })} required />
                        </div>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Month</label>
                            <input type="number" min="1" max="12" className="form-control" value={form.month}
                                   onChange={(e) => setForm({ ...form, month: e.target.value })} required />
                        </div>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Year</label>
                            <input type="number" className="form-control" value={form.year}
                                   onChange={(e) => setForm({ ...form, year: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Set budget</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div className="card-title" style={{ margin: 0 }}>Remaining budget</div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input type="number" min="1" max="12" className="form-control" placeholder="Month"
                               style={{ width: 100 }} value={checkMonth} onChange={(e) => setCheckMonth(e.target.value)} />
                        <input type="number" className="form-control" placeholder="Year"
                               style={{ width: 100 }} value={checkYear} onChange={(e) => setCheckYear(e.target.value)} />
                        <button className="btn btn-gold btn-sm" onClick={checkRemaining}>Check</button>
                    </div>
                </div>

                {(!remaining || remaining.length === 0) && <div className="empty-state">{remainingMsg}</div>}

                {remaining && remaining.length > 0 && (
                    <table>
                        <thead><tr><th>Category</th><th>Limit</th><th>Spent</th><th>Remaining</th></tr></thead>
                        <tbody>
                            {remaining.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.category}</td>
                                    <td>{formatMoney(r.monthlyLimit)}</td>
                                    <td>{formatMoney(r.spent)}</td>
                                    <td style={{ color: r.remaining < 0 ? "var(--danger)" : "var(--success)", fontWeight: 600 }}>
                                        {formatMoney(r.remaining)} {r.remaining < 0 ? "(over budget)" : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <div className="card-title">All budgets</div>
                {loaded && budgets.length === 0 && <div className="empty-state">No budgets set yet.</div>}
                {budgets.length > 0 && (
                    <table>
                        <thead><tr><th>Category</th><th>Limit</th><th>Month/Year</th><th></th></tr></thead>
                        <tbody>
                            {budgets.map((b) => (
                                <tr key={b._id}>
                                    <td>{b.categoryId ? b.categoryId.name : "—"}</td>
                                    <td>{formatMoney(b.monthlyLimit)}</td>
                                    <td>{b.month}/{b.year}</td>
                                    <td><button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(b._id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}
