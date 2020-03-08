const User = require('../models/user')
const permit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(404).json({
                msg: 'No user found!'
            })
        }

        if (!user.isAdmin) {
            return res.status(401).json({
                msg: 'Restricted! Permission Denied!'
            })
        }
        next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
}

module.exports = permit