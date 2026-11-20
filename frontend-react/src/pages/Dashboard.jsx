import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { request } from "../api"
import { formatMoney } from "../utils"

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ["#1F5C4E", "#C99A2E", "#B23A2E", "#2F7D5D", "#55645F", "#8A6D3B", "#4A7C6F", "#D98C6B"]

export default function Dashboard() {
    const [summary, setSummary] = useState(null)
    const [chartData, setChartData] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        (async () => {
            const s = await request("get", "/dashboard/summary")
            if (s.status === 1) setSummary(s.data)
            else setError(s.message)

            const c = await request("get", "/dashboard/chart")
            if (c.status === 1 && c.data.length > 0) {
                setChartData({
                    labels: c.data.map((r) => r._id),
                    datasets: [{
                        data: c.data.map((r) => r.total),
                        backgroundColor: COLORS.slice(0, c.data.length),
                        borderWidth: 0
                    }]
                })
            }
        })()
    }, [])

    return (
        <>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Your money, at a glance.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="stat-grid">
                <div className="stat-card gold">
                    <div className="stat-label">Total balance</div>
                    <div className="stat-value">{summary ? formatMoney(summary.totalBalance) : "—"}</div>
                </div>
                <div className="stat-card income">
                    <div className="stat-label">Monthly income</div>
                    <div className="stat-value">{summary ? formatMoney(summary.monthlyIncome) : "—"}</div>
                </div>
                <div className="stat-card expense">
                    <div className="stat-label">Monthly expense</div>
                    <div className="stat-value">{summary ? formatMoney(summary.monthlyExpense) : "—"}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Savings this month</div>
                    <div className="stat-value">{summary ? formatMoney(summary.savings) : "—"}</div>
                </div>
            </div>

            <div className="card">
                <div className="card-title">Expense breakdown by category</div>
                {chartData
                    ? <Doughnut data={chartData} options={{ plugins: { legend: { position: "right" } } }} />
                    : <div className="empty-state">No expense data yet — add a transaction to see this chart.</div>}
            </div>
        </>
    )
}
