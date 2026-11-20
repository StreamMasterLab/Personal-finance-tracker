import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { request } from "../../api"
import { formatDate } from "../../utils"

export default function ClientsList() {
    const [clients, setClients] = useState([])
    const [loaded, setLoaded] = useState(false)

    async function load() {
        const res = await request("get", "/admin/clients")
        setClients(res.status === 1 ? res.data : [])
        setLoaded(true)
    }

    useEffect(() => { load() }, [])

    return (
        <>
            <div className="page-header">
                <h1>Clients</h1>
                <p>Everyone using Ledger.</p>
            </div>

            {loaded && clients.length === 0 && <div className="empty-state">No client accounts yet.</div>}

            {clients.length > 0 && (
                <div className="card">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th></th></tr></thead>
                        <tbody>
                            {clients.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{formatDate(c.createdAt)}</td>
                                    <td><Link to={`/admin/clients/${c._id}`} className="btn btn-sm btn-outline">View</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
