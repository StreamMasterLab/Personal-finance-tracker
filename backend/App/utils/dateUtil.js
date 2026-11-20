// India Standard Time is UTC+5:30, with no daylight saving.
// JS Date objects always store a UTC instant internally, and MongoDB does the same.
// This helper shifts "now" by the IST offset so the stored/returned timestamp's
// clock value matches IST wall-clock time.
let getISTDate = () => {
    let now = new Date()
    let istOffsetMs = 5.5 * 60 * 60 * 1000
    return new Date(now.getTime() + istOffsetMs)
}

// Converts a stored (already IST-shifted) Date into a display string
// like "2026-09-12T18:45:30+05:30" instead of the default "...Z" (UTC label)
let toISTString = (date) => {
    if (!date) return null
    let d = new Date(date)
    let pad = (n) => String(n).padStart(2, "0")
    // use UTC getters: the value was already shifted by +5:30 when stored,
    // so reading it back with getUTC* gives the correct IST wall-clock numbers
    // regardless of what timezone the server itself is running in
    let str =
        d.getUTCFullYear() + "-" +
        pad(d.getUTCMonth() + 1) + "-" +
        pad(d.getUTCDate()) + "T" +
        pad(d.getUTCHours()) + ":" +
        pad(d.getUTCMinutes()) + ":" +
        pad(d.getUTCSeconds()) + "+05:30"
    return str
}

module.exports = { getISTDate, toISTString }
