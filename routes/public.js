const router = require('express').Router();
//nodemailer staff & reset staff
const {
    promisify
} = require('util');
const {
    randomBytes
} = require('crypto');
const {
    transport,
    emailTemplate
} = require('../utils/nodemailer');
const bcrypt = require('bcryptjs')
//models
const User = require('../models/Dev');
const Job = require('../models/Job');
const Company = require('../models/Company');

//const paginatedResults = require('../middleware/pagination');

//get all blogs

router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find()

        return res.json({
            jobs
        })

    } catch (error) {
        return res.status(500).json({
            err: 'Something went wrong'
        })
    }
})
//get filter
// router.get('/jobs/filtered', async (req, res) => {
//     try {
//         const blogs = await Job.find({
//             'level': {
//                 $in: [req.query.level]
//             }
//         }).sort({
//             createdAt: -1
//         })
// .populate({
//     path: 'comments',
//     populate: {
//         path: 'owner'
//     }
// })
// .populate('author');

// return res.json({
//     blogs
// })
// }
// catch (error) {
//     return res.status(500).json({
//         error
//     })
// }
// })
//get specific blog

router.get('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById({
            _id: req.params.id
        })



        return res.json({
            job
        })
    } catch (error) {
        return res.status(404).json({
            error: `job not found, ooooopsy ${error}`
        })
    }
})

//get all companies
router.get('/companies', async (req, res) => {

    try {
        const companies = await Company.find().select('-password')

        return res.json({
            companies
        })
    } catch (error) {
        return res.status(401).json({
            error
        })
    }

})

//get a specific company

router.get('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findById({
            _id: req.params.id
        }).select('-password')


        return res.json({
            company
        })
    } catch (error) {
        return res.status(404).json({
            error: `dev not found, ooooopsy ${error}`
        })
    }
})

//get all devs
router.get('/devs', async (req, res) => {

    try {
        const devs = await Dev.find().select('-password')

        return res.json({
            devs
        })
    } catch (error) {
        return res.status(401).json({
            error
        })
    }

})

//get a specific dev

router.get('/devs/:id', async (req, res) => {
    try {
        const dev = await Dev.findById({
            _id: req.params.id
        }).select('-password')


        return res.json({
            dev
        })
    } catch (error) {
        return res.status(404).json({
            error: `dev not found, ooooopsy ${error}`
        })
    }
})



module.exports = router;