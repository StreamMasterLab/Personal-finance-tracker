let express = require("express")
let {
    setBudget,
    budgetList,
    remainingBudget,
    updateBudget,
    deleteBudget
} = require("../../controllers/web/budgetController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.post("/set", setBudget)
router.get("/list", budgetList)
router.get("/remaining", remainingBudget)
router.put("/update/:id", updateBudget)
router.delete("/delete/:id", deleteBudget)

module.exports = router
