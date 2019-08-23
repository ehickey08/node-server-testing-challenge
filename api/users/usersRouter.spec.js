const request = require('supertest');
const db = require('../../data/dbConfig');
const Users = require('../users/usersModel');
const server = require('../server');
const knex = require('knex')
const config = require('../../knexfile')

describe('users router', () => {
    beforeAll(() => {
        return  knex(config.testing).seed.run()
    });

    it('test Users.getAll', async () => {
        const users = await Users.getAll();
        expect(users).toHaveLength(3);
    });
});

