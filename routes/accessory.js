const { Router } = require('express')
const { getAllCubes, getCube, updateCube, getCubeWithAccessories } = require('../controllers/cubes')
const { getAccessories } = require('../controllers/accessories')
const Cube = require('../models/cube')
const Accessory = require('../models/accessory')
const { authAccess, getUserStatus, authAccessJSON } = require('../controllers/users')

const router = Router();

router.get('/create/accessory', authAccess, getUserStatus, (req, res) => {
    res.render('createAccessory', {
        title: 'Create Accessory | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    })
});

router.post('/create/accessory', authAccessJSON, async (req, res) => {
    const {
        name,
        description,
        imageUrl
    } = req.body

    const accessory = new Accessory({ name, description, imageUrl })
    await accessory.save()

    res.redirect('/create/accessory')
});

router.get('/attach/accessory/:id', authAccess, getUserStatus, async (req, res) => {
    const cube = await getCube(req.params.id)
    const accessories = await getAccessories()

    const cubeAccessories = cube.accessories.map(acc => acc._id.valueOf().toString())
    const notAttachedAccessories = accessories.filter((acc) => {
        const accessoryString = acc._id.valueOf().toString()
        return !cubeAccessories.includes(accessoryString)
    })

    res.render('attachAccessory', {
        title: 'Attach Accessory | Cube Workshop',
        cube: cube,
        accessories: notAttachedAccessories,
        isFullyAttached: cube.accessories.length === accessories.length,
        isLoggedIn: req.isLoggedIn
    })
});

router.post('/attach/accessory/:id', authAccessJSON, async (req, res) => {
    const {
        accessory
    } = req.body

    updateCube(req.params.id, accessory)

    res.redirect(`/details/${req.params.id}`)
});

module.exports = router