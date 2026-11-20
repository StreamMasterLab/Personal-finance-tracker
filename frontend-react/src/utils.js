export function formatMoney(n) {
    n = Number(n) || 0
    return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
}

export function formatDate(d) {
    if (!d) return "-"
    const date = new Date(d)
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}
