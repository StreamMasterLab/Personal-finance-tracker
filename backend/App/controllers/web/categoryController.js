let model = require("../../models/categoryModel") // import model

let addCategory = (req, res) => {
    let { name, type } = req.body
    let category = new model({
        userId: req.userId,
        name,
        type
    })
    category.save().then(() => {
        res.send({ status: 1, message: "category added successfully" })
    }).catch((err) => {
        res.send({ status: 0, message: err })
    })
}

let categoryList = async (req, res) => {
    let categories = await model.find({ userId: req.userId })
    if (categories.length == 0) {
        res.status(400).send({ status: 0, message: "no categories found" })
        return
    }
    res.status(200).send({ status: 1, message: "categories found", data: categories })
}

let updateCategory = async (req, res) => {
    let category = await model.updateOne(
        { _id: req.params.id, userId: req.userId },
        { $set: { name: req.body.name, type: req.body.type } }
    )
    if (category.modifiedCount == 0) {
        res.status(400).send({ status: 0, message: "category not found" })
        return
    }
    res.status(200).send({ status: 1, message: "category updated successfully" })
}

let deleteCategory = async (req, res) => {
    let category = await model.deleteOne({ _id: req.params.id, userId: req.userId })
    if (category.deletedCount == 0) {
        res.status(400).send({ status: 0, message: "category not found" })
        return
    }
    res.status(200).send({ status: 1, message: "category deleted successfully" })
}

module.exports = { addCategory, categoryList, updateCategory, deleteCategory }
