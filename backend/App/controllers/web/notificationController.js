let model = require("../../models/notificationModel") // import model

let notificationList = async (req, res) => {
    let notifications = await model.find({ userId: req.userId }).sort({ createdAt: -1 })
    if (notifications.length == 0) {
        res.status(400).send({ status: 0, message: "no notifications found" })
        return
    }
    res.status(200).send({ status: 1, message: "notifications found", data: notifications })
}

let markAsRead = async (req, res) => {
    let notification = await model.updateOne(
        { _id: req.params.id, userId: req.userId },
        { $set: { isRead: true } }
    )
    if (notification.modifiedCount == 0) {
        res.status(400).send({ status: 0, message: "notification not found" })
        return
    }
    res.status(200).send({ status: 1, message: "notification marked as read" })
}

let deleteNotification = async (req, res) => {
    let notification = await model.deleteOne({ _id: req.params.id, userId: req.userId })
    if (notification.deletedCount == 0) {
        res.status(400).send({ status: 0, message: "notification not found" })
        return
    }
    res.status(200).send({ status: 1, message: "notification deleted successfully" })
}

module.exports = { notificationList, markAsRead, deleteNotification }
