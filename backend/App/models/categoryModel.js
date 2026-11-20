var mongoose = require("mongoose")
let schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
})
let model = mongoose.model("categories", schema)

module.exports = model
