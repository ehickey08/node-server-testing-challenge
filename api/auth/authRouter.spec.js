const request = require('supertest');
const db = require('../../data/dbConfig');
const Users = require('../users/usersModel');
const server = require('../server');
const knex = require('knex')
const config = require('../../knexfile')

describe('auth router with db', () => {
    beforeAll(() => {
        return knex(config.testing).seed.run();
    });

    it('should find a user in the db', async () => {
        const foundUser = await Users.findByUsername('Bill').first();
        expect(foundUser).toEqual(
            expect.objectContaining({
                department: 'finance',
                id: expect.any(Number),
                password: expect.any(String),
                username: 'Bill',
            })
        );
    });

    it('responds with json of a token and message', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                username: 'Bill',
                password: '123',
            });
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/json/);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
                token: expect.any(String),
            })
        );
    });
});
describe('auth router without db', () => {
    beforeAll( () => {
        return db('users').truncate();
    });

    describe('testing Users.add in User Model', () => {
        it('should add a user', async () => {
            const user = {
                username: 'Danny',
                password: '1234',
                department: 'sales',
            };
            const addedUser = await Users.add(user);

            expect(addedUser).toEqual(
                expect.objectContaining({
                    department: 'sales',
                    id: expect.any(Number),
                    password: '1234',
                    username: 'Danny',
                })
            );
        });
    });

    describe('test /register route', () => {
        it('responds with json of newUser',  (done) => {
            request(server)
                .post('/auth/register')
                .send({
                    username: 'William',
                    password: '1234',
                    department: 'legal',
                }).then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            department: 'legal',
                            id: expect.any(Number),
                            password: expect.any(String),
                            username: 'William',
                        })
                    );
                    expect(response.type).toMatch(/json/);
                    done()
                });
        });
    });
});
