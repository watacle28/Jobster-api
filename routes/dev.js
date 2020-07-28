const router = require('express').Router();
const axios = require('axios');
const Dev = require('../models/Dev');



const {
    check,
    validationResult
} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload')



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
    //todo
})


module.exports = router;