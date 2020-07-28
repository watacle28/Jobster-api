const {
    Schema,
    model
} = require('mongoose');

const CompanySchema = Schema({
    userType: {
        type: String,
        default: 'Company'
    },
    name: String,
    email: {
        type: String,
        unique: true
    },
    website: String,
    location: String,
    logo: String,
    password: String,
    jobs: [{
        type: Schema.Types.ObjectId
    }],
    resetToken: String,
    resetTokenExpiry: Date,
    verified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

module.exports = model('Company', CompanySchema);