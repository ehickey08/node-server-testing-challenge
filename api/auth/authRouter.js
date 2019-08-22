const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Users = require('../users/usersModel');
const { checkUserAtReg, checkUserAtLogin } = require('../middleware');
const secrets = require('../config/secrets')

const router = express.Router();

router.post('/register', checkUserAtReg, async ( req, res, next) => {
    try {
        let user = req.body;
        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash;
        const newUser = await Users.add(user);
        res.status(201).json(newUser);
    } catch (err) {
        next({ err, stat: 500, message: 'Could not register user.' });
    }
});

router.post('/login', checkUserAtLogin, (req, res, next) => {
    const { username, password } = req.body;
    Users.findByUsername(username)
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                const token = generateToken(user)
                res.status(200).json({message: `Welcome ${user.username}!`, token });
            }
            else 
                next({stat: 401, message: 'Invalid credentials'})
        })
        .catch(err => {
            next({ err, stat: 500, message: 'Error during login.' });
        });
});

router.get('/logout', (req, res) => {
    if(req.session.username){
        req.session.destroy(err => {
            if(err)
                res.status(400).json({You: 'could not be logged out!' });
            else
                res.status(200).json({You:'were logged out!' });
        })
    } else{
        res.status(400).json({You:'were never logged in!' });
    }
})

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    }

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}
module.exports = router;
