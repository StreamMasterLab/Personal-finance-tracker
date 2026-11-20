let model = require("../../models/transactionModel") // import model

let addTransaction = (req, res) => {
    let { categoryId, type, amount, note, date } = req.body
    let transaction = new model({
        userId: req.userId,
        categoryId,
        type,
        amount,
        note,
        date
    })
    transaction.save().then(() => {
        res.send({ status: 1, message: "transaction added successfully" })
    }).catch((err) => {
        res.send({ status: 0, message: err })
    })
}

let transactionList = async (req, res) => {
    let transactions = await model.find({ userId: req.userId }).populate("categoryId").sort({ date: -1 })
    if (transactions.length == 0) {
        res.status(400).send({ status: 0, message: "no transactions found" })
        return
    }
    res.status(200).send({ status: 1, message: "transactions found", data: transactions })
}

let updateTransaction = async (req, res) => {
    let { categoryId, type, amount, note, date } = req.body
    let transaction = await model.updateOne(
        { _id: req.params.id, userId: req.userId },
        { $set: { categoryId, type, amount, note, date } }
    )
    if (transaction.modifiedCount == 0) {
        res.status(400).send({ status: 0, message: "transaction not found" })
        return
    }
    res.status(200).send({ status: 1, message: "transaction updated successfully" })
}

let deleteTransaction = async (req, res) => {
    let transaction = await model.deleteOne({ _id: req.params.id, userId: req.userId })
    if (transaction.deletedCount == 0) {
        res.status(400).send({ status: 0, message: "transaction not found" })
        return
    }
    res.status(200).send({ status: 1, message: "transaction deleted successfully" })
}

let searchTransaction = async (req, res) => {
    let { keyword } = req.query
    let transactions = await model.find({
        userId: req.userId,
        note: { $regex: keyword || "", $options: "i" }
    }).populate("categoryId")
    if (transactions.length == 0) {
        res.status(400).send({ status: 0, message: "no transactions found" })
        return
    }
    res.status(200).send({ status: 1, message: "transactions found", data: transactions })
}

module.exports = { addTransaction, transactionList, updateTransaction, deleteTransaction, searchTransaction }
