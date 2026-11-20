var mongoose = require("mongoose")
let { getISTDate } = require("../utils/dateUtil")
let schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    type: {
        type: String,
        enum: ["budget_warning", "bill_reminder", "goal", "email"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: getISTDate
    }
})
let model = mongoose.model("notifications", schema)

module.exports = model
