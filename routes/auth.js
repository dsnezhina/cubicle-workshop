const { Router } = require('express')
const User = require('../models/user')
const { saveUser, verifyUser, guestAccess, getUserStatus } = require('../controllers/users')


const router = Router();

router.get('/login', guestAccess, getUserStatus, (req, res) => {

    res.render('loginPage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/signup', guestAccess, getUserStatus, (req, res) => {

    res.render('registerPage', {
        isLoggedIn: req.isLoggedIn
    })
})


router.post('/signup', async (req, res) => {
    const { password, repeatPassword } = req.body


    if (!password || password.length < 8 || !password.match(/^[A-Za-z0-9]+$/)) {
        return res.render('registerPage', {
            error: 'Username or password is not valid'
        })
    }

    if (password !== repeatPassword) {
        return res.render('registerPage', {
            error: 'Re-Password should be the same as Password'
        })
    }

    const { error } = await saveUser(req, res)

    if (error) {
        return res.render('registerPage', {
            error: 'Username or password is not valid'
        })
    }

    res.redirect('/')
})

router.post('/login', async (req, res) => {

    const { error } = await verifyUser(req, res)

    if (error) {
        return res.render('loginPage', {
            error: 'Username or password is not correct'
        })
    }

    res.redirect('/')
})



module.exports = router