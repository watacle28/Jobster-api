const {
    Schema,
    model
} = require('mongoose');

const JobSchema = Schema({
    company: String,
    companyId: {
        type: Schema.Types.ObjectId
    },
    logo: String,
    isnew: Boolean,
    featured: Boolean,
    position: String,
    role: String,
    level: String,
    postedAt: Date,
    contact: String,
    location: String,
    languages: [String],
    applications: Number,
    tools: [String],
    verified: {
        type: Boolean,
        default: false
    },


}, {
    timestamps: true
})

module.exports = model('Job', JobSchema)