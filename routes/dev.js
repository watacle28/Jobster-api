const router = require('express').Router();
const axios = require('axios');
const Dev = require('../models/Dev');



const {
    check,
    validationResult
} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload');
const {
    transport,
    emailTemplate
} = require('../utils/nodemailer');
const Job = require('../models/Job');
const Company = require('../models/Company');



//get user info -> private
router.get('/me', async (req, res) => {
    const country = await axios.get('https://ipapi.co/json/')

    try {
        //get user
        const user = await Dev.findById({
                _id: req.user.user
            }).select('-password')
            .populate('jobs')
        return res.json({
            user
        })

    } catch (error) {
        return res.status(404).json({
            error: 'user not found'
        })
    }
})


router.post('/upload', uploader.single('avatar'), async (req, res) => {

    //get user
    console.log(req.user);
    const user = await Dev.findById(
        req.user.user
    )

    //upload avatar
    try {
        user.avatar = req.file.url;
        const userWithAvatar = await user.save();
        return res.json({
            user: userWithAvatar
        })
    } catch (error) {
        return res.status(400).json({
            error
        })
    }
})

//edit own profile
router.put('/me', uploader.single('resume'), async (req, res) => {

    const user = await Dev.findById(req.user.user)
    const {
        fullname,
        bio,
        role,
        location,
        github,
        website,
        stack
    } = req.body


    if (!user) {
        return res.status(400).json({
            err: 'user not found'
        })
    }

    if (fullname) user.fullname = fullname
    if (bio) user.bio = bio
    if (role) user.role = role
    if (req.file && req.file.url) user.resume = req.file.url
    if (location) user.location = location
    if (github) user.github = github
    if (website) user.website = website
    if (stack) {
        const stackArray = stack.trim().split(',').map(tool => tool.trim())
        user.stack = stackArray
    }
    if (user.fullname && user.bio && user.role && user.location && user.github && user.website && user.resume && user.stack.length > 0) {
        user.profileComplete = true
    }

    await user.save()
    console.log({
        user
    });
    return res.json({
        user
    })

})

router.delete('dev/me', async (req, res) => {
    try {
        await Dev.findByIdAndDelete(req.user.user)
        res.json({
            msg: 'Life is better inside but take care for now, ciao'
        })
    } catch (error) {
        return res.json({
            error
        })
    }
})

router.post('dev/apply/:jobId', async (req, res) => {
    //check if profile is complete
    const dev = await Dev.findById(req.user.user)

    if (dev.profileComplete) {
        const job = await Job.findById(req.params.jobId)
        //company 
        const company = await Company.findById(job.companyId)

        //send application mail to company
        const message = {
            from: 'sirwatacle@gmail.com',
            to: `${company.email}`,
            subject: `${dev.fullname} - ${job.role}`,
            html: `${emailTemplate(dev)}`,
            attachments: [{
                filename: `resume for ${dev.fullname}`,
                path: `${dev.resume}`
            }]
        }
        transport.sendMail(message, async (err, info) => {
            if (err) {
                return res.status(500).json({
                    error: 'something went wrong'
                })
            }
            console.log({
                info
            });
            job.applications++;
            await job.save()
            return res.json({
                msg: 'application successfull'
            })
        })
    }
})



module.exports = router;