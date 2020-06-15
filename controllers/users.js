const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const generateToken = data => {
    const token = jwt.sign(data, config.privateKey)
    return token
}

const saveUser = async (req, res) => {

    const {
        username,
        password
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
        username,
        password: hashedPassword
    })

    const userObject = await user.save()

    const token = generateToken({
        userId: userObject._id,
        username: userObject.username
    })

    res.cookie('aid', token)

    return true
}

const verifyUser = async (req, res) => {
    const {
        username,
        password
    } = req.body

    //get User by username

    const user = await User.findOne({ username: username })

    const status = bcrypt.compare(password, user.password)

    if (status) {
        const token = generateToken({
            userId: user._id,
            username: user.username
        })

        res.cookie('aid', token)
    }

    return status
}

const authAccess = (req, res, next) => {
    const token = req.cookies['aid'];

    if (!token) {
        return res.redirect('/')
    }

    try {
        const decodedObject = jwt.verify(token, config.privateKey)
        next()
    } catch (err) {
        res.redirect('/')
    }
}

const authAccessJSON = (req, res, next) => {
    const token = req.cookies['aid'];

    if (!token) {
        return res.json({
            error: "Not authenticated"
        })
    }

    try {
        const decodedObject = jwt.verify(token, config.privateKey)
        next()
    } catch (err) {
        return res.json({
            error: "Not authenticated"
        })
    }
}

const guestAccess = (req, res, next) => {
    const token = req.cookies['aid']

    if (token) {
        return res.redirect('/')
    }

    next()
}

const getUserStatus = (req, res, next) => {
    const token = req.cookies['aid']

    if (!token) {
        req.isLoggedIn = false
    }

    try {
        jwt.verify(token, config.privateKey)
        req.isLoggedIn = true
    } catch (err) {
        req.isLoggedIn = false
    }

    next()
}

module.exports = {
    saveUser,
    verifyUser,
    authAccess,
    guestAccess,
    getUserStatus,
    authAccessJSON
}

