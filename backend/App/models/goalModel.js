var mongoose = require("mongoose")
let schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    savedAmount: {
        type: Number,
        default: 0
    },
    targetDate: {
        type: Date,
        required: true
    }
})
let model = mongoose.model("goals", schema)

module.exports = model
