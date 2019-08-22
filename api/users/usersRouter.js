const express = require('express');
const { restricted } = require('../middleware');
const Users = require('./usersModel')

const router = express.Router()

router.use('/', restricted)

router.get('/', async (req, res, next) => {
    const department = req.jwtToken.department
    try{
        const users = await Users.getAll()
        res.status(200).json(users.filter(user => user.department === department));
    }catch(err){
        next({err, stat: 500, message: 'Could not retrieve Users'})
    }
})

module.exports = router;