import { useEffect, useState } from "react"
import { request } from "../api"

const emptyForm = { name: "", type: "expense" }

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    async function loadCategories() {
        const res = await request("get", "/category/list")
        setCategories(res.status === 1 ? res.data : [])
        setLoaded(true)
    }

    useEffect(() => { loadCategories() }, [])

    function startEdit(c) {
        setEditId(c._id)
        setForm({ name: c.name, type: c.type })
    }

    function resetForm() {
        setEditId(null)
        setForm(emptyForm)
    }

    async function handleDelete(id) {
        if (!confirm("Delete this category?")) return
        const res = await request("delete", `/category/delete/${id}`)
        if (res.status === 1) loadCategories()
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        const res = editId
            ? await request("put", `/category/update/${editId}`, form)
            : await request("post", "/category/add", form)

        if (res.status === 1) {
            resetForm()
            loadCategories()
        } else {
            setError(res.message)
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Categories</h1>
                <p>Group your money by where it goes.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <div className="card-title">{editId ? "Edit category" : "Add a category"}</div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 14, alignItems: "end" }}>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Name</label>
                            <input type="text" className="form-control" placeholder="e.g. Food" value={form.name}
                                   onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                            <label>Type</label>
                            <select className="form-control" value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">{editId ? "Save" : "Add"}</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="card-title">Your categories</div>
                {loaded && categories.length === 0 && (
                    <div className="empty-state">No categories yet — try Food, Transport, Others.</div>
                )}
                {categories.length > 0 && (
                    <table>
                        <thead><tr><th>Name</th><th>Type</th><th></th></tr></thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.name}</td>
                                    <td><span className={`tag ${c.type}`}>{c.type}</span></td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <button className="btn btn-sm btn-outline" onClick={() => startEdit(c)}>Edit</button>{" "}
                                        <button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(c._id)}>Delete</button>
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
