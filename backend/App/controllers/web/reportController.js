let transactionModel = require("../../models/transactionModel")
let userModel = require("../../models/userModel")
let { getISTDate } = require("../../utils/dateUtil")
var mongoose = require("mongoose")
let PDFDocument = require("pdfkit")

// type = daily | weekly | monthly
let getReport = async (req, res) => {
    let userId = new mongoose.Types.ObjectId(req.userId)
    let { type } = req.params
    let now = getISTDate()
    let startDate

    if (type == "daily") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (type == "weekly") {
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
    } else if (type == "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else {
        res.status(400).send({ status: 0, message: "invalid report type, use daily/weekly/monthly" })
        return
    }

    let transactions = await transactionModel.find({ userId: userId, date: { $gte: startDate } })
        .populate("categoryId")
        .sort({ date: -1 })

    if (transactions.length == 0) {
        res.status(400).send({ status: 0, message: "no data found for this report" })
        return
    }
    res.status(200).send({ status: 1, message: type + " report", data: transactions })
}

// generates a real PDF file (not JSON) - the response IS the PDF, streamed directly
let exportReport = async (req, res) => {
    let userId = new mongoose.Types.ObjectId(req.userId)
    let user = await userModel.findById(userId)
    let transactions = await transactionModel.find({ userId: userId }).populate("categoryId").sort({ date: -1 })

    if (transactions.length == 0) {
        res.status(400).send({ status: 0, message: "no data found to export" })
        return
    }

    let totalIncome = 0
    let totalExpense = 0
    transactions.forEach((t) => {
        if (t.type === "income") totalIncome += t.amount
        else totalExpense += t.amount
    })

    let doc = new PDFDocument({ margin: 40, size: "A4" })
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=finance-report.pdf")
    doc.pipe(res)

    doc.fontSize(18).text("Personal Finance Tracker — Transaction Report", { align: "center" })
    doc.moveDown(0.3)
    doc.fontSize(10).fillColor("#555").text(user ? user.name + " (" + user.email + ")" : "", { align: "center" })
    doc.moveDown(1)

    doc.fillColor("#000").fontSize(12)
    doc.text("Total Income:  Rs. " + totalIncome.toFixed(2))
    doc.text("Total Expense: Rs. " + totalExpense.toFixed(2))
    doc.text("Net Balance:   Rs. " + (totalIncome - totalExpense).toFixed(2))
    doc.moveDown(1)

    doc.fontSize(11).text("Date        Type       Category         Amount        Note", { underline: true })
    doc.moveDown(0.3)

    doc.fontSize(10)
    transactions.forEach((t) => {
        let dateStr = new Date(t.date).toLocaleDateString("en-IN")
        let catName = t.categoryId ? t.categoryId.name : "-"
        let line = `${dateStr}   ${t.type.padEnd(8)}   ${catName.padEnd(14)}   Rs.${t.amount.toFixed(2).padEnd(10)}   ${t.note || ""}`
        doc.text(line)
    })

    doc.end()
}

module.exports = { getReport, exportReport }
