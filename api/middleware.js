const jwt = require('jsonwebtoken')
const Users = require('./users/usersModel');
const secrets = require('./config/secrets')

module.exports = {
    restricted,
    checkUserAtReg,
    checkUserAtLogin,
};

function restricted(req, res, next) {
    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if(err){
                res.status(401).json('Invalid credentials.');
            } else{
                req.jwtToken = decodedToken;
                next();
            }
        });
    } else{
        res.status(400).json({You:'are not logged in!' });
    }
}

async function checkUserAtReg(req, res, next) {
    const { username, password } = req.body;
    try {
        if (!username || !password)
            next({
                stat: 400,
                message: 'Please include a username and password.',
            });
        else {
            const storedUser = await Users.findByUsername(username).first();
            if (storedUser && username === storedUser.username)
                next({
                    stat: 401,
                    message:
                        'Username is already in use, please choose another.',
                });
            else next();
        }
    } catch (err) {
        next({ err, stat: 500, message: 'Could not register user' });
    }
}

function checkUserAtLogin(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password)
        next({ stat: 400, message: 'Please include a username and password' });
    else next();
}
