let express = require("express")
let { listClients, clientSummary, deleteClient } = require("../../controllers/web/adminController")
let verifyToken = require("../../middlewares/authMiddleware")
let isAdmin = require("../../middlewares/adminMiddleware")
let router = express.Router()

router.use(verifyToken, isAdmin)
router.get("/clients", listClients)
router.get("/clients/:id", clientSummary)
router.delete("/clients/:id", deleteClient)

module.exports = router
