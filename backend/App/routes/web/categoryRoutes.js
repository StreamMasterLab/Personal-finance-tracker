let express = require("express")
let { addCategory, categoryList, updateCategory, deleteCategory } = require("../../controllers/web/categoryController")
let verifyToken = require("../../middlewares/authMiddleware")
let router = express.Router()

router.use(verifyToken)
router.post("/add", addCategory)
router.get("/list", categoryList)
router.put("/update/:id", updateCategory)
router.delete("/delete/:id", deleteCategory)

module.exports = router
