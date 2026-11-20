import { useState } from "react"
import { request, downloadFile } from "../api"
import { formatMoney, formatDate } from "../utils"

export default function Reports() {
    const [type, setType] = useState(null)
    const [rows, setRows] = useState([])
    const [msg, setMsg] = useState("Choose Daily, Weekly, or Monthly to see a report.")
    const [alert, setAlert] = useState(null)

    async function loadReport(t) {
        setType(t)
        const res = await request("get", `/report/${t}`)
        if (res.status === 1) {
            setRows(res.data)
        } else {
            setRows([])
            setMsg(res.message || "No data for this period.")
        }
    }

    async function handleExport() {
        const res = await downloadFile("/report/export/pdf", "finance-report.pdf")
        if (res.status === 1) {
            setAlert({ type: "success", text: "PDF downloaded." })
        } else {
            setAlert({ type: "error", text: res.message })
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Reports</h1>
                <p>Look back over any period.</p>
            </div>

            {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

            <div className="card">
                <div style={{ display: "flex", gap: 10 }}>
                    {["daily", "weekly", "monthly"].map((t) => (
                        <button key={t} className={`btn ${type === t ? "btn-primary" : "btn-outline"}`}
                                onClick={() => loadReport(t)}>
                            {t[0].toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                    <button className="btn btn-gold" style={{ marginLeft: "auto" }} onClick={handleExport}>Export data</button>
                </div>
            </div>

            <div className="card">
                <div className="card-title">{type ? `${type[0].toUpperCase() + type.slice(1)} report` : "Select a period above"}</div>
                {rows.length === 0 && <div className="empty-state">{msg}</div>}
                {rows.length > 0 && (
                    <table>
                        <thead><tr><th>Date</th><th>Category</th><th>Type</th><th>Note</th><th>Amount</th></tr></thead>
                        <tbody>
                            {rows.map((t) => (
                                <tr key={t._id}>
                                    <td>{formatDate(t.date)}</td>
                                    <td>{t.categoryId ? t.categoryId.name : "—"}</td>
                                    <td><span className={`tag ${t.type}`}>{t.type}</span></td>
                                    <td>{t.note || "—"}</td>
                                    <td>{formatMoney(t.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}
