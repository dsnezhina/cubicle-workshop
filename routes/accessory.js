const { Router } = require('express')
const { getAllCubes, getCube, updateCube, getCubeWithAccessories } = require('../controllers/cubes')
const { getAccessories } = require('../controllers/accessories')
const Cube = require('../models/cube')
const Accessory = require('../models/accessory')

const router = Router();

router.get('/create/accessory', (req, res) => {
    res.render('createAccessory', {
        title: 'Create Accessory | Cube Workshop'
    })
});

router.post('/create/accessory', async (req, res) => {
    const {
        name,
        description,
        imageUrl
    } = req.body

    const accessory = new Accessory({ name, description, imageUrl })
    await accessory.save()

    res.redirect('/create/accessory')
});

router.get('/attach/accessory/:id', async (req, res) => {
    const cube = await getCube(req.params.id)
    const accessories = await getAccessories()

    const cubeAccessories = cube.accessories.map(acc => acc._id.valueOf().toString())
    const notAttachedAccessories = accessories.filter((acc) => {
        const accessoryString = acc._id.valueOf().toString()
        return !cubeAccessories.includes(accessoryString)
    })

    console.log(accessories);
    console.log(notAttachedAccessories)

    res.render('attachAccessory', {
        title: 'Attach  Accessory | Cube Workshop',
        cube: cube,
        accessories: notAttachedAccessories,
        isFullyAttached: cube.accessories.length === accessories.length
    })
});

router.post('/attach/accessory/:id', async (req, res) => {
    const {
        accessory
    } = req.body

    updateCube(req.params.id, accessory)

    res.redirect(`/details/${req.params.id}`)
});

module.exports = router