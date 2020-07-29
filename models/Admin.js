const {
    Schema,
    model
} = require('mongoose');

const AdminSchema = Schema({
    userType: {
        type: String,
        default: 'Admin'
    },
    fullname: String,
    password: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    resetToken: String,
    resetTokenExpiry: Date

}, {
    timestamps: true
})

module.exports = model('Admin', AdminSchema);