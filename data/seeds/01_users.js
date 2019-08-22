const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users')
        .truncate()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                {
                    username: 'Bill',
                    password: bcrypt.hashSync('123', 12),
                    department: 'finance',
                },
                {
                    username: 'Jill',
                    password: bcrypt.hashSync('456', 12),
                    department: 'legal',
                },
                {
                    username: 'Greg',
                    password: bcrypt.hashSync('789', 12),
                    department: 'brand',
                },
            ]);
        });
};
