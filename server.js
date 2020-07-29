require('dotenv').config();
require('colors')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cors())


const checkAuth = require('./middleware/checkAuth')
const isAdmin = require('./middleware/isAdmin')
const PORT = process.env.PORT || 5003;


//route imports
const devAuth = require('./routes/devAuth')
const companyAuth = require('./routes/companyAuth')

const dev = require('./routes/dev')
const company = require('./routes/company')
const public = require('./routes/public')
const job = require('./routes/job')
const canCreate_EDIT_DEL = require('./middleware/canEditOrDEL');
const Job = require('./models/Job');
const adminAuth = require('./routes/adminAuth')
const admin = require('./routes/admin')

//middleware inits

app.use('/api/auth/dev', devAuth);
app.use('/api/auth/company', companyAuth);
app.use('/api/dev', checkAuth, dev);
app.use('/api/company', checkAuth, company);
app.use('/api/public', public);
app.use('/api/job', checkAuth, canCreate_EDIT_DEL(Job), job)
app.use('api/auth/admin', adminAuth)
app.use('/api/admin', checkAuth, isAdmin, admin)

// app and db connect

mongoose.connect(process.env.MONGOURI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('database connected succesfully'.bgGreen);
        app.listen(PORT, () => console.log(`server started at ${PORT} use http://localhost:${PORT} to connect`.bgMagenta))
    })


// TODO 

// 7. apply for job