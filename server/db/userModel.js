const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please provide a first name"],
        unique: [true, "Email Exist"],
    },

    lastname: {
        type: String,
        required: [true, "Please provide a last name"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide an Email"],
        unique: [true, "Email Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);