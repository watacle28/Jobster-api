const {
    Schema,
    model
} = require('mongoose');

const DevSchema = Schema({
    userType: {
        type: String,
        default: 'Dev'
    },
    fullname: String,
    role: String,
    email: {
        type: String,
        unique: true
    },
    resume: String,
    location: String,
    avatar: String,
    password: String,
    stack: [String],
    github: String,
    website: String,
    resetToken: String,
    resetTokenExpiry: Date

}, {
    timestamps: true
})

module.exports = model('Dev', DevSchema);