import { useEffect, useState } from "react"
import { request } from "../api"
import { formatMoney, formatDate } from "../utils"

const emptyForm = { type: "expense", categoryId: "", amount: "", note: "", date: "" }

export default function Transactions() {
    const [categories, setCategories] = useState([])
    const [transactions, setTransactions] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    async function loadCategories() {
        const res = await request("get", "/category/list")
        if (res.status === 1) setCategories(res.data)
    }

    async function loadTransactions(keyword) {
        const endpoint = keyword ? `/transaction/search?keyword=${encodeURIComponent(keyword)}` : "/transaction/list"
        const res = await request("get", endpoint)
        setTransactions(res.status === 1 ? res.data : [])
        setLoaded(true)
    }

    useEffect(() => {
        loadCategories()
        loadTransactions()
    }, [])

    useEffect(() => {
        const t = setTimeout(() => loadTransactions(search), 350)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    function startEdit(t) {
        setEditId(t._id)
        setForm({
            type: t.type,
            categoryId: t.categoryId ? t.categoryId._id : "",
            amount: t.amount,
            note: t.note || "",
            date: t.date ? t.date.substring(0, 10) : ""
        })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function resetForm() {
        setEditId(null)
        setForm(emptyForm)
    }

    async function handleDelete(id) {
        if (!confirm("Delete this transaction?")) return
        const res = await request("delete", `/transaction/delete/${id}`)
        if (res.status === 1) loadTransactions(search)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        const body = {
            type: form.type,
            categoryId: form.categoryId,
            amount: parseFloat(form.amount),
            note: form.note,
            date: form.date || undefined
        }
        const res = editId
            ? await request("put", `/transaction/update/${editId}`, body)
            : await request("post", "/transaction/add", body)

        if (res.status === 1) {
            resetForm()
            loadTransactions(search)
        } else {
            setError(res.message)
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Transactions</h1>
                <p>Every rupee in and out.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <div className="card-title">{editId ? "Edit transaction" : "Add a transaction"}</div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="form-row">
                            <label>Type</label>
                            <select className="form-control" value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Category</label>
                            <select className="form-control" value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name} ({c.type})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Amount (₹)</label>
                            <input type="number" step="0.01" className="form-control" value={form.amount}
                                   onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                        </div>
                        <div className="form-row">
                            <label>Date</label>
                            <input type="date" className="form-control" value={form.date}
                                   onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div className="form-row" style={{ gridColumn: "1 / -1" }}>
                            <label>Note</label>
                            <input type="text" className="form-control" placeholder="e.g. Groceries at DMart"
                                   value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">{editId ? "Save changes" : "Add transaction"}</button>
                    {editId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel edit</button>}
                </form>
            </div>

            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div className="card-title" style={{ margin: 0 }}>All transactions</div>
                    <input type="text" className="form-control" placeholder="Search by note…"
                           style={{ maxWidth: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {loaded && transactions.length === 0 && (
                    <div className="empty-state">
                        {search ? "No transactions match that search." : "No transactions yet — add your first one above."}
                    </div>
                )}

                {transactions.length > 0 && (
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Category</th><th>Type</th><th>Note</th><th>Amount</th><th></th></tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t._id}>
                                    <td>{formatDate(t.date)}</td>
                                    <td>{t.categoryId ? t.categoryId.name : "—"}</td>
                                    <td><span className={`tag ${t.type}`}>{t.type}</span></td>
                                    <td>{t.note || "—"}</td>
                                    <td>{formatMoney(t.amount)}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <button className="btn btn-sm btn-outline" onClick={() => startEdit(t)}>Edit</button>{" "}
                                        <button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(t._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}
