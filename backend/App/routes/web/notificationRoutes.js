let express = require("express")
let { notificationList, markAsRead, deleteNotification } = require("../../controllers/web/notificationController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.get("/list", notificationList)
router.put("/mark-read/:id", markAsRead)
router.delete("/delete/:id", deleteNotification)

module.exports = router
