import { Link } from "react-router-dom"

const features = [
    { icon: "💰", title: "Track income & expenses", text: "Log every transaction and sort it into categories in seconds." },
    { icon: "📊", title: "Visual reports", text: "See where your money actually goes with live charts, not spreadsheets." },
    { icon: "🎯", title: "Savings goals", text: "Set a target, watch a progress bar fill up as you save toward it." },
    { icon: "📅", title: "Monthly budgets", text: "Set a limit per category and get warned before you overspend." },
    { icon: "📄", title: "Downloadable reports", text: "Export a clean PDF of your transactions whenever you need one." },
    { icon: "🔒", title: "Secure by design", text: "Hashed passwords and JWT-secured sessions keep your data private." }
]

export default function Home() {
    return (
        <div>
            <nav className="landing-nav">
                <div className="brand">Ledger<span>.</span></div>
                <div className="nav-actions">
                    <Link to="/login" className="btn btn-outline">Log in</Link>
                    <Link to="/register" className="btn btn-primary">Sign up free</Link>
                </div>
            </nav>

            <section className="hero">
                <h1>Take control of your money.</h1>
                <p>
                    Ledger is a personal finance tracker — log income and expenses, set monthly budgets,
                    chase savings goals, and see all of it on one clear dashboard.
                </p>
                <div className="hero-actions">
                    <Link to="/register" className="btn btn-gold">Get started — it's free</Link>
                    <Link to="/login" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
                        I already have an account
                    </Link>
                </div>
            </section>

            <section className="features-section">
                <h2>Everything you need to manage your money</h2>
                <div className="feature-grid">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <div className="icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="landing-footer">
                Personal Finance Tracker — built with Node.js, Express, MongoDB & React.
            </footer>
        </div>
    )
}
