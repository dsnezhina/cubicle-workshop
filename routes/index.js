const { Router } = require('express')
const { getAllCubes, getCube, updateCube, getCubeWithAccessories } = require('../controllers/cubes')
const { getAccessories } = require('../controllers/accessories')
const Cube = require('../models/cube')
const Accessory = require('../models/accessory')
const { getUserStatus } = require('../controllers/users')

const router = Router();

router.get('/', getUserStatus, async (req, res) => {
    const cubes = await getAllCubes()

    res.render('index', {
        title: 'Cube Workshop',
        cubes: cubes,
        isLoggedIn: req.isLoggedIn
    })
});

router.get('/about', getUserStatus, (req, res) => {
    res.render('about', {
        title: 'About | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    })
});

module.exports = router
