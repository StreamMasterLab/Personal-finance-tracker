// Run this once to create your admin account:
//   node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword
//
// If the email already exists as a client, this promotes it to admin instead.

require("dotenv").config()
let mongoose = require("mongoose")
let bcrypt = require("bcryptjs")
let userModel = require("../App/models/userModel")

async function run() {
    let [, , name, email, password] = process.argv
    if (!name || !email || !password) {
        console.log("Usage: node scripts/createAdmin.js \"Admin Name\" admin@example.com yourpassword")
        process.exit(1)
    }

    await mongoose.connect(process.env.dbUrl)

    let existing = await userModel.findOne({ email })
    if (existing) {
        existing.role = "admin"
        await existing.save()
        console.log("Existing user promoted to admin:", email)
    } else {
        let hash = await bcrypt.hash(password, 10)
        await userModel.create({ name, email, password: hash, role: "admin" })
        console.log("Admin account created:", email)
    }

    await mongoose.disconnect()
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
