var mongoose = require("mongoose")
let { getISTDate } = require("../utils/dateUtil")
let schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    date: {
        type: Date,
        default: getISTDate
    }
})
let model = mongoose.model("transactions", schema)

module.exports = model
