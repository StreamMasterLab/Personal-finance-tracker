var jwt = require("jsonwebtoken")

let verifyToken = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        res.status(401).send({ status: 0, message: "token not found, please login" })
        return
    }
    token = token.split(" ")[1] // format: Bearer <token>
    jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            res.status(401).send({ status: 0, message: "invalid or expired token" })
            return
        }
        req.userId = decoded.id
        next()
    })
}

module.exports = verifyToken
