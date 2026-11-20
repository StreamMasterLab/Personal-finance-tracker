let express = require("express")
let { getReport, exportReport } = require("../../controllers/web/reportController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.get("/export/pdf", exportReport)
router.get("/:type", getReport) // /daily, /weekly, /monthly

module.exports = router
