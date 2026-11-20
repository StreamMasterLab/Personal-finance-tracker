import axios from "axios"

// Base URL of the backend you already built (Node.js + Express + MongoDB).
// Change this if your backend runs somewhere other than localhost:3000.
export const API_BASE = "http://localhost:3000/web/api"

const instance = axios.create({ baseURL: API_BASE })

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("pft_token")
    if (token) config.headers.Authorization = "Bearer " + token
    return config
})

// Always resolves to the backend's {status, message, data} shape,
// whether the call succeeded or the backend returned an error status.
export async function request(method, url, data) {
    try {
        const res = await instance.request({ method, url, data })
        return res.data
    } catch (err) {
        if (err.response) {
            if (err.response.status === 401) {
                localStorage.removeItem("pft_token")
                localStorage.removeItem("pft_user")
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login"
                }
            }
            return err.response.data
        }
        return { status: 0, message: "Cannot reach the backend. Is it running at " + API_BASE + "?" }
    }
}

// Downloads a binary file response (e.g. the PDF export) and saves it via the browser.
// Kept separate from request() because that one assumes a JSON body.
export async function downloadFile(url, filename) {
    try {
        const res = await instance.get(url, { responseType: "blob" })
        const blobUrl = URL.createObjectURL(res.data)
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        URL.revokeObjectURL(blobUrl)
        return { status: 1 }
    } catch (err) {
        if (err.response && err.response.data) {
            try {
                const text = await err.response.data.text()
                return JSON.parse(text)
            } catch {
                return { status: 0, message: "Could not download the report" }
            }
        }
        return { status: 0, message: "Cannot reach the backend. Is it running at " + API_BASE + "?" }
    }
}
