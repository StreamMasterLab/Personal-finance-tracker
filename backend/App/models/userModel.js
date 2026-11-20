var mongoose = require("mongoose")
let { getISTDate } = require("../utils/dateUtil")
let schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["client", "admin"],
        default: "client"
    },
    createdAt: {
        type: Date,
        default: getISTDate
    }
})
let model = mongoose.model("users", schema)

module.exports = model
