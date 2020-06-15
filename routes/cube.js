const { Router } = require('express')
const { getAllCubes, getCube, updateCube, getCubeWithAccessories } = require('../controllers/cubes')
const { getAccessories } = require('../controllers/accessories')
const Cube = require('../models/cube')
const Accessory = require('../models/accessory')
const jwt = require('jsonwebtoken')
const { authAccess, getUserStatus, authAccessJSON } = require('../controllers/users')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const router = Router();

router.get('/edit', authAccess, getUserStatus, (req, res) => {
    res.render('editCubePage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/delete', authAccess, getUserStatus, (req, res) => {
    res.render('DeleteCubePage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/details/:id', getUserStatus, async (req, res) => {
    const cube = await getCubeWithAccessories(req.params.id)

    res.render('details', {
        title: 'Details | Cube Workshop',
        ...cube,
        isLoggedIn: req.isLoggedIn
    })
});

router.get('/create', authAccess, getUserStatus, (req, res) => {
    res.render('create', {
        title: 'Create Cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    })
});

router.post('/create', authAccessJSON,  (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body

    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)

    const cube = new Cube({
        name,
        description,
        imageUrl,
        difficulty: difficultyLevel,
        creatorId: decodedObject.userId
    })
    cube.save((err) => {
        if (err) {
            console.error(err)
            res.redirect('/create')
        } else {
            res.redirect('/')
        }
    })
});

module.exports = router