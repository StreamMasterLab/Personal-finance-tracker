let budgetModel = require("../../models/budgetModel") // import model
let transactionModel = require("../../models/transactionModel")
let notificationModel = require("../../models/notificationModel")

let setBudget = (req, res) => {
    let { categoryId, monthlyLimit, month, year } = req.body
    let budget = new budgetModel({
        userId: req.userId,
        categoryId,
        monthlyLimit,
        month,
        year
    })
    budget.save().then(() => {
        res.send({ status: 1, message: "budget set successfully" })
    }).catch((err) => {
        res.send({ status: 0, message: err })
    })
}

let budgetList = async (req, res) => {
    let budgets = await budgetModel.find({ userId: req.userId }).populate("categoryId")
    if (budgets.length == 0) {
        res.status(400).send({ status: 0, message: "no budgets found" })
        return
    }
    res.status(200).send({ status: 1, message: "budgets found", data: budgets })
}

// calculates remaining budget per category and raises a budget_warning notification if exceeded
let remainingBudget = async (req, res) => {
    let now = new Date()
    let month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1
    let year = req.query.year ? parseInt(req.query.year) : now.getFullYear()

    let budgets = await budgetModel.find({ userId: req.userId, month, year }).populate("categoryId")
    if (budgets.length == 0) {
        res.status(400).send({ status: 0, message: "no budgets found for this month" })
        return
    }

    let result = []
    for (let b of budgets) {
        let spent = await transactionModel.aggregate([
            { $match: { userId: b.userId, categoryId: b.categoryId._id, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
        let spentAmount = spent.length > 0 ? spent[0].total : 0
        let remaining = b.monthlyLimit - spentAmount

        if (remaining < 0) {
            let notification = new notificationModel({
                userId: req.userId,
                type: "budget_warning",
                message: "Budget exceeded for " + b.categoryId.name
            })
            await notification.save()
        }

        result.push({
            category: b.categoryId.name,
            monthlyLimit: b.monthlyLimit,
            spent: spentAmount,
            remaining: remaining
        })
    }
    res.status(200).send({ status: 1, message: "remaining budget calculated", data: result })
}

let updateBudget = async (req, res) => {
    let budget = await budgetModel.updateOne(
        { _id: req.params.id, userId: req.userId },
        { $set: { monthlyLimit: req.body.monthlyLimit } }
    )
    if (budget.modifiedCount == 0) {
        res.status(400).send({ status: 0, message: "budget not found" })
        return
    }
    res.status(200).send({ status: 1, message: "budget updated successfully" })
}

let deleteBudget = async (req, res) => {
    let budget = await budgetModel.deleteOne({ _id: req.params.id, userId: req.userId })
    if (budget.deletedCount == 0) {
        res.status(400).send({ status: 0, message: "budget not found" })
        return
    }
    res.status(200).send({ status: 1, message: "budget deleted successfully" })
}

module.exports = { setBudget, budgetList, remainingBudget, updateBudget, deleteBudget }
