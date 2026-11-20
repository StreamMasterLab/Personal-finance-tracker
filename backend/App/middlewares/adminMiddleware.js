let userModel = require("../models/userModel")

// Must run AFTER verifyToken (needs req.userId already set)
let isAdmin = async (req, res, next) => {
    let user = await userModel.findById(req.userId)
    if (!user || user.role !== "admin") {
        res.status(403).send({ status: 0, message: "admin access required" })
        return
    }
    next()
}

module.exports = isAdmin
