let express = require("express")
var mongoose = require("mongoose")
let cors = require("cors")
require('dotenv').config()

const authRoutes = require("./App/routes/web/authRoutes")
const categoryRoutes = require("./App/routes/web/categoryRoutes")
const transactionRoutes = require("./App/routes/web/transactionRoutes")
const budgetRoutes = require("./App/routes/web/budgetRoutes")
const goalRoutes = require("./App/routes/web/goalRoutes")
const dashboardRoutes = require("./App/routes/web/dashboardRoutes")
const reportRoutes = require("./App/routes/web/reportRoutes")
const notificationRoutes = require("./App/routes/web/notificationRoutes")
const adminRoutes = require("./App/routes/web/adminRoutes")

let app = express()
app.use(cors())
app.use(express.json())

app.use("/web/api/auth", authRoutes)
app.use("/web/api/category", categoryRoutes)
app.use("/web/api/transaction", transactionRoutes)
app.use("/web/api/budget", budgetRoutes)
app.use("/web/api/goal", goalRoutes)
app.use("/web/api/dashboard", dashboardRoutes)
app.use("/web/api/report", reportRoutes)
app.use("/web/api/notification", notificationRoutes)
app.use("/web/api/admin", adminRoutes)

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("Connected to MongoDb")
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port " + (process.env.PORT || 3000))
    })
}).catch((err) => {
    console.log("DB connection error", err)
})
