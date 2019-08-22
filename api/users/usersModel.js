const db = require('../../data/dbConfig')

module.exports = {
    getAll,
    findByUsername,
    add,
    findById
}

function getAll(){
    return db('users')
}

function findByUsername(username) {
    return db('users').where({username})
}

function add(user){
    return db('users').insert(user).then(([id]) => findById(id))
}

function findById(id){
    return db('users').where({id}).first()
}