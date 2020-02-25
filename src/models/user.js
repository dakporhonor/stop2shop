const mongoose = require('mongoose')

const userSChema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
     date: {
         type: Date,
         default: Date.now
     }
})

const User = mongoose.model('User', userSChema)

module.exports = User