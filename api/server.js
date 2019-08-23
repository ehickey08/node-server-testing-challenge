const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./users/usersRouter');
const authRouter = require('./auth/authRouter');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/auth', authRouter);
server.use('/users', usersRouter);

server.use(errorHandler);

function errorHandler(error, req, res, next) {
    console.log(error.err || '');
    res.status(error.stat || 500).json({
        error: error.message || 'Internal server error.',
    });
}

server.get('/', (req, res, next) => {
    res.send('Server is working!');
});

module.exports = server;
