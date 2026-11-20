let express = require("express")
let { dashboardSummary, chartData } = require("../../controllers/web/dashboardController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.get("/summary", dashboardSummary)
router.get("/chart", chartData)

module.exports = router
