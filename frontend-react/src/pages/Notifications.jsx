import { useEffect, useState } from "react"
import { request } from "../api"
import { formatDate } from "../utils"

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [loaded, setLoaded] = useState(false)

    async function loadNotifications() {
        const res = await request("get", "/notification/list")
        setNotifications(res.status === 1 ? res.data : [])
        setLoaded(true)
    }

    useEffect(() => { loadNotifications() }, [])

    async function markRead(id) {
        const res = await request("put", `/notification/mark-read/${id}`)
        if (res.status === 1) loadNotifications()
    }

    async function handleDelete(id) {
        const res = await request("delete", `/notification/delete/${id}`)
        if (res.status === 1) loadNotifications()
    }

    return (
        <>
            <div className="page-header">
                <h1>Notifications</h1>
                <p>Budget warnings and alerts land here.</p>
            </div>

            {loaded && notifications.length === 0 && (
                <div className="empty-state">
                    No notifications yet. Budget warnings appear here once you check "Remaining budget".
                </div>
            )}

            {notifications.map((n) => (
                <div className="card" key={n._id}
                     style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: n.isRead ? 0.6 : 1 }}>
                    <div>
                        <span className={`tag ${n.type === "budget_warning" ? "expense" : "income"}`}>
                            {n.type.replace("_", " ")}
                        </span>
                        <div style={{ marginTop: 8 }}>{n.message}</div>
                        <div style={{ color: "var(--ink-soft)", fontSize: 12.5, marginTop: 4 }}>{formatDate(n.createdAt)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, whiteSpace: "nowrap" }}>
                        {!n.isRead && <button className="btn btn-sm btn-outline" onClick={() => markRead(n._id)}>Mark read</button>}
                        <button className="btn btn-sm btn-danger-outline" onClick={() => handleDelete(n._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </>
    )
}
