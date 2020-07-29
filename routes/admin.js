const router = require('express').Router();
const Co = require('../models/Company')
const Job = require('../models/Job')
const Dev = require('../models/Dev');

//verify company
router.put('/company/:id/verify', async (req, res) => {
    try {
        const company = await Co.findById(req.params.id);
        company.verified = true;
        await company.save()
        return res.json({
            msg: 'company verified'
        })
    } catch (error) {
        return res.status(500).json('something went wrong')
    }
})

//verify job
router.put('/job/:id/verify', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        job.verified = true;
        await job.save()
        return res.json({
            msg: 'job verified'
        })
    } catch (error) {
        return res.status(500).json('something went wrong')
    }
})

//delete model handler
const deleteModel = async (model) => {
    try {
        await model.findByIdAndDelete(req.params.id);
        return res.json({
            msg: 'document deleted'
        })

    } catch (error) {
        return res.status(500).json(error)
    }
}

router.delete('/job/:id', async (req, res) => {
    await deleteModel(Job)
})

router.delete('/co/:id', async (req, res) => {
    await deleteModel(Co)
})

router.delete('/dev/:id', async (req, res) => {
    await deleteModel(Dev)
})


module.exports = router;