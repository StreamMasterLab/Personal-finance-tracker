let express = require("express")
let {
    addTransaction,
    transactionList,
    updateTransaction,
    deleteTransaction,
    searchTransaction
} = require("../../controllers/web/transactionController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.post("/add", addTransaction)
router.get("/list", transactionList)
router.get("/search", searchTransaction)
router.put("/update/:id", updateTransaction)
router.delete("/delete/:id", deleteTransaction)

module.exports = router
