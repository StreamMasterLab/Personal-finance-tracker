let express = require("express")
let { register, login, forgotPassword, profile, updateProfile } = require("../../controllers/web/authController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.get("/profile", verifyToken, profile)
router.put("/profile-update", verifyToken, updateProfile)

module.exports = router
