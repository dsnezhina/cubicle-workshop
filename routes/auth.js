const { Router } = require('express')
const User = require('../models/user')
const { saveUser } = require('../controllers/users')

const router = Router();

router.get('/login', (req, res) => {
    res.render('loginPage')
})

router.get('/signup', (req, res) => {
    res.render('registerPage')
})

router.post('/signup', async (req, res) => {

    const status = await saveUser(req, res)

    if (status) {
        return res.redirect('/')
    }

    res.redirect('/')
})



module.exports = router