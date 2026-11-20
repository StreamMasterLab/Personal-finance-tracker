let model = require("../../models/goalModel") // import model

let addGoal = (req, res) => {
    let { title, targetAmount, targetDate } = req.body
    let goal = new model({
        userId: req.userId,
        title,
        targetAmount,
        targetDate
    })
    goal.save().then(() => {
        res.send({ status: 1, message: "goal added successfully" })
    }).catch((err) => {
        res.send({ status: 0, message: err })
    })
}

let goalList = async (req, res) => {
    let goals = await model.find({ userId: req.userId })
    if (goals.length == 0) {
        res.status(400).send({ status: 0, message: "no goals found" })
        return
    }
    let data = goals.map((g) => {
        let progress = ((g.savedAmount / g.targetAmount) * 100).toFixed(2)
        return {
            _id: g._id,
            title: g.title,
            targetAmount: g.targetAmount,
            savedAmount: g.savedAmount,
            targetDate: g.targetDate,
            progress: progress + "%"
        }
    })
    res.status(200).send({ status: 1, message: "goals found", data: data })
}

// add money towards a goal (progress bar update)
let updateGoalProgress = async (req, res) => {
    let { amount } = req.body
    let goal = await model.findOne({ _id: req.params.id, userId: req.userId })
    if (!goal) {
        res.status(400).send({ status: 0, message: "goal not found" })
        return
    }
    goal.savedAmount = goal.savedAmount + amount
    await goal.save()
    res.status(200).send({ status: 1, message: "goal progress updated", data: goal })
}

let deleteGoal = async (req, res) => {
    let goal = await model.deleteOne({ _id: req.params.id, userId: req.userId })
    if (goal.deletedCount == 0) {
        res.status(400).send({ status: 0, message: "goal not found" })
        return
    }
    res.status(200).send({ status: 1, message: "goal deleted successfully" })
}

module.exports = { addGoal, goalList, updateGoalProgress, deleteGoal }
