const router = require('express').Router();
const axios = require('axios');
const Company = require('../models/Company');

//multer configs import
const uploader = require('../utils/upload')


//get company info -> private
router.get('/me', async (req, res) => {

    try {
        //get user
        const company = await Company.findById({
                _id: req.user.user
            }).select('-password')
            .populate('jobs')
        return res.json({
            company
        })

    } catch (error) {
        return res.status(404).json({
            error: 'user not found'
        })
    }
})



//edit own profile
router.put('/me', uploader.single('logo'), async (req, res) => {

    const company = await Dev.findById(req.user.user)
    const {

        location,

        website,

    } = req.body


    if (!company) {
        return res.status(400).json({
            err: 'user not found'
        })
    }


    if (req.file && req.file.url) company.logo = req.file.url
    if (location) company.location = location

    if (website) company.website = website



    await user.save()
    console.log({
        company
    });
    return res.json({
        company
    })

})

router.delete('/me', async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.user.user)
        res.json({
            msg: 'Life is better inside but take care for now, ciao'
        })
    } catch (error) {
        return res.json({
            error
        })
    }
})



module.exports = router;