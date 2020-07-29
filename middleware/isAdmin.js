const isAdmin = (req, res, next) => {
    if (req.user.userType != 'Admin') return res.status(403).json({
        err: 'not an admin'
    })
    else {
        next()
    }
}
module.exports = isAdmin;