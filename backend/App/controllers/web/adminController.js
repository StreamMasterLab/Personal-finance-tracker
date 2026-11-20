let userModel = require("../../models/userModel") // import model
let transactionModel = require("../../models/transactionModel")
let categoryModel = require("../../models/categoryModel")
let budgetModel = require("../../models/budgetModel")
let goalModel = require("../../models/goalModel")
let notificationModel = require("../../models/notificationModel")
var mongoose = require("mongoose")

let listClients = async (req, res) => {
    let clients = await userModel.find({ role: "client" }).select("-password").sort({ createdAt: -1 })
    if (clients.length == 0) {
        res.status(400).send({ status: 0, message: "no clients found" })
        return
    }
    res.status(200).send({ status: 1, message: "clients found", data: clients })
}

// one client's account info + their financial totals, for the admin to review
let clientSummary = async (req, res) => {
    let clientId = req.params.id
    let client = await userModel.findOne({ _id: clientId, role: "client" }).select("-password")
    if (!client) {
        res.status(400).send({ status: 0, message: "client not found" })
        return
    }

    let userObjId = new mongoose.Types.ObjectId(clientId)
    let income = await transactionModel.aggregate([
        { $match: { userId: userObjId, type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    let expense = await transactionModel.aggregate([
        { $match: { userId: userObjId, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    let totalIncome = income.length > 0 ? income[0].total : 0
    let totalExpense = expense.length > 0 ? expense[0].total : 0
    let transactionCount = await transactionModel.countDocuments({ userId: userObjId })

    res.status(200).send({
        status: 1,
        message: "client summary",
        data: {
            client,
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            transactionCount
        }
    })
}

// removes the client account and all of their financial data
let deleteClient = async (req, res) => {
    let clientId = req.params.id
    let client = await userModel.findOneAndDelete({ _id: clientId, role: "client" })
    if (!client) {
        res.status(400).send({ status: 0, message: "client not found" })
        return
    }
    await transactionModel.deleteMany({ userId: clientId })
    await categoryModel.deleteMany({ userId: clientId })
    await budgetModel.deleteMany({ userId: clientId })
    await goalModel.deleteMany({ userId: clientId })
    await notificationModel.deleteMany({ userId: clientId })

    res.status(200).send({ status: 1, message: "client and their data removed successfully" })
}

module.exports = { listClients, clientSummary, deleteClient }
