let model = require("../../models/userModel") // import model
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
let { toISTString } = require("../../utils/dateUtil")

let register = (req, res) => {
    let { name, email, password } = req.body
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.send({ status: 0, message: err })
            return
        }
        let user = new model({
            name,
            email,
            password: hash
        })
        user.save().then(() => {
            res.send({ status: 1, message: "registered successfully" })
        }).catch((err) => {
            res.send({ status: 0, message: err })
        })
    })
}

let login = async (req, res) => {
    let { email, password } = req.body
    let user = await model.findOne({ email: email })
    if (!user) {
        res.status(400).send({ status: 0, message: "user not found" })
        return
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
            res.status(400).send({ status: 0, message: "invalid password" })
            return
        }
        let token = jwt.sign({ id: user._id }, process.env.jwtSecret, { expiresIn: "7d" })
        res.status(200).send({
            status: 1,
            message: "login successful",
            token: token,
            data: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    })
}

let forgotPassword = async (req, res) => {
    let { email, newPassword } = req.body
    let user = await model.findOne({ email: email })
    if (!user) {
        res.status(400).send({ status: 0, message: "user not found" })
        return
    }
    bcrypt.hash(newPassword, 10, async (err, hash) => {
        await model.updateOne({ _id: user._id }, { $set: { password: hash } })
        res.status(200).send({ status: 1, message: "password updated successfully" })
    })
}

let profile = async (req, res) => {
    let user = await model.findById(req.userId).select("-password")
    if (!user) {
        res.status(400).send({ status: 0, message: "user not found" })
        return
    }
    let data = { ...user._doc, createdAt: toISTString(user.createdAt) }
    res.status(200).send({ status: 1, message: "profile found", data: data })
}

let updateProfile = async (req, res) => {
    let { name, email } = req.body
    let user = await model.updateOne({ _id: req.userId }, { $set: { name, email } })
    if (user.modifiedCount == 0) {
        res.status(400).send({ status: 0, message: "no changes made" })
        return
    }
    res.status(200).send({ status: 1, message: "profile updated successfully" })
}

module.exports = { register, login, forgotPassword, profile, updateProfile }
