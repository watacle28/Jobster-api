const router = require('express').Router();
const Company = require('../models/Company');
const Job = require('../models/Job');

const {
    check,
    validationResult
} = require('express-validator');
//multer configs import
const uploader = require('../utils/upload');

//create a job -> pvt
router.post('/create', [
    check('position', 'field can not be empty').not().isEmpty(),
    check('role', 'field can not be empty').not().isEmpty(),
    check('contract', 'field can not be empty').not().isEmpty(),
    check('location', 'field can not be empty').not().isEmpty(),
    check('level', 'field can not be empty').not().isEmpty(),
    check('languages', 'field can not be empty').not().isEmpty(),
    check('tools', 'field can not be empty').not().isEmpty()
], async (req, res) => {
    //check for user input errors and send errors if any
    const {
        user,
        logo,
        company
    } = req.user
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map(error => error.msg)
        })
    }
    const {
        position,
        role,
        level,
        contract,
        location,
        languages,
        tools
    } = req.body;
    let langArray = languages.trim().split(',').map(lang => lang.trim())
    let toolsArray = tools.trim().split(',').map(tool => tool.trim())

    try {
        const newJob = await new Job({
            company,
            logo,
            companyId: req.user.user,
            isnew: true,
            featured: false,
            position,
            role,
            level,
            postedAt: new Date(),
            contract,
            location,
            languages: langArray,
            tools: toolsArray
        }).save();
        //get user and assign post
        const user = await Company.findById(req.user.user)
        const jobs = user.jobs;
        jobs.push(newJob._id)
        await user.save()

        return res.json({
            newJob
        });

    } catch (error) {
        return res.status(404).json({
            error
        })
    }
})

//edit a blog
router.put('/edit/:id', async (req, res) => {
    //check if user owns the blog
    const blogsByUser = await Company.findById(req.user.user)

    const isOwner = blogsByUser.posts.filter(blog => blog == req.params.id);

    if (isOwner.length < 1) {
        return res.status(401).json({
            msg: 'sorry you dont own the blog'
        })
    }
    //user owns post so can edit

    // try {


    const postToEdit = await Job.findById(req.params.id)

    if (req.body.body) {

        postToEdit.body = req.body.body

    }
    if (req.body.title) {

        postToEdit.title = req.body.title

    }
    if (req.body.tags) {

        let tagArray = req.body.tags.trim().split(',').map(tag => tag.trim())
        postToEdit.tags = tagArray

    }


    await postToEdit.save()

    return res.json({
        editedPost: postToEdit
    })

    // } catch (error) {
    //     return res.status(400).json({
    //         error
    //     })
    // }
})
//remove post
router.delete('/post/:id', async (req, res) => {
    //check if user owns the blog
    const blogger = await Company.findById(req.user.user)

    const isOwner = blogger.posts.filter(blog => blog == req.params.id);

    if (isOwner.length < 1) {
        return res.status(401).json({
            msg: 'sorry you dont own the blog'
        })
    }
    try {
        await Job.findByIdAndDelete(req.params.id)
        blogger.posts.pull(req.params.id)
        await blogger.save()
        return res.json({
            msg: 'post deleted'
        })

    } catch (error) {
        return res.status(404).json({
            err: 'post not found'
        })
    }

})




// postToUnlike.likes.pull(req.user.user)
// await postToUnlike.save();
module.exports = router;