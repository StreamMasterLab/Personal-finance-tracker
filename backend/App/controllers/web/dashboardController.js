let transactionModel = require("../../models/transactionModel")
let { getISTDate } = require("../../utils/dateUtil")
var mongoose = require("mongoose")

let dashboardSummary = async (req, res) => {
    let userId = new mongoose.Types.ObjectId(req.userId)
    let now = getISTDate()
    let month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1
    let year = req.query.year ? parseInt(req.query.year) : now.getFullYear()

    let allIncome = await transactionModel.aggregate([
        { $match: { userId: userId, type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    let allExpense = await transactionModel.aggregate([
        { $match: { userId: userId, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    let totalBalance = (allIncome.length > 0 ? allIncome[0].total : 0) - (allExpense.length > 0 ? allExpense[0].total : 0)

    let monthlyIncome = await transactionModel.aggregate([
        {
            $match: {
                userId: userId,
                type: "income",
                $expr: { $and: [{ $eq: [{ $month: "$date" }, month] }, { $eq: [{ $year: "$date" }, year] }] }
            }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    let monthlyExpense = await transactionModel.aggregate([
        {
            $match: {
                userId: userId,
                type: "expense",
                $expr: { $and: [{ $eq: [{ $month: "$date" }, month] }, { $eq: [{ $year: "$date" }, year] }] }
            }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    let mIncome = monthlyIncome.length > 0 ? monthlyIncome[0].total : 0
    let mExpense = monthlyExpense.length > 0 ? monthlyExpense[0].total : 0

    res.status(200).send({
        status: 1,
        message: "dashboard summary",
        data: {
            totalBalance: totalBalance,
            monthlyIncome: mIncome,
            monthlyExpense: mExpense,
            savings: mIncome - mExpense
        }
    })
}

// expense breakdown by category, used to render pie/bar charts on the frontend
let chartData = async (req, res) => {
    let userId = new mongoose.Types.ObjectId(req.userId)
    let categoryWise = await transactionModel.aggregate([
        { $match: { userId: userId, type: "expense" } },
        { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        { $group: { _id: "$category.name", total: { $sum: "$amount" } } }
    ])
    res.status(200).send({ status: 1, message: "chart data", data: categoryWise })
}

module.exports = { dashboardSummary, chartData }
