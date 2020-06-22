const { Router } = require('express')
const { getAllCubes, getCube, updateCube, getCubeWithAccessories, deleteCube } = require('../controllers/cubes')
const { getAccessories } = require('../controllers/accessories')
const Cube = require('../models/cube')
const Accessory = require('../models/accessory')
const jwt = require('jsonwebtoken')
const { authAccess, getUserStatus, authAccessJSON } = require('../controllers/users')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const router = Router();

router.get('/edit/:id', authAccess, getUserStatus, (req, res) => {
    res.render('editCubePage', {
        isLoggedIn: req.isLoggedIn
    })
})

router.get('/delete/:id', authAccess, getUserStatus, async (req, res) => {
    const cube = await getCubeWithAccessories(req.params.id)

    const options = [
        { title: '1 - Very Easy', selected: 1 == cube.difficulty },
        { title: '2 - Easy', selected: 2 == cube.difficulty },
        { title: '3 - Medium (Standard 3x3)', selected: 3 == cube.difficultyLevel },
        { title: '4 - Intermediate', selected: 4 == cube.difficulty },
        { title: '5 - Expert', selected: 5 == cube.difficulty },
        { title: '6 - Hardcore', selected: 6 == cube.difficulty },
    ]

    res.render('DeleteCubePage', {
        title: 'Delete Cube | Cube Workshop',
        ...cube,
        options,
        isLoggedIn: req.isLoggedIn
    })
})

router.post('/delete/:id', authAccess, getUserStatus, async (req, res, next) => {
    const id = req.params.id

    try {
        await deleteCube(id)
        return res.redirect('/')

    } catch (err) {
        next(err)
    }
})

router.get('/details/:id', getUserStatus, async (req, res) => {
    const cube = await getCubeWithAccessories(req.params.id)

    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)

    res.render('details', {
        title: 'Details | Cube Workshop',
        isCreator: cube.creatorId.toString() === decodedObject.userID.toString(),
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

router.post('/create', authAccessJSON, async (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body

    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)

    const cube = new Cube({
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        difficulty: difficultyLevel,
        creatorId: decodedObject.userID
    })

    try {
        await cube.save()
        return res.redirect('/')

    } catch (err) {
        res.render('create', {
            title: 'Create Cube | Cube Workshop',
            isLoggedIn: req.isLoggedIn,
            error: 'Cube details are not valid'
        })
    }


});

module.exports = router