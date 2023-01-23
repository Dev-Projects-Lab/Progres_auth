const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
    oauth: { type: Boolean, required: true, default: false },
    profile: { type: String, required: false }
});

module.exports = mongoose.model("User", userSchema)