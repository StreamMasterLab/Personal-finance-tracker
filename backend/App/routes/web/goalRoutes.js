let express = require("express")
let { addGoal, goalList, updateGoalProgress, deleteGoal } = require("../../controllers/web/goalController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.post("/add", addGoal)
router.get("/list", goalList)
router.put("/update-progress/:id", updateGoalProgress)
router.delete("/delete/:id", deleteGoal)

module.exports = router
