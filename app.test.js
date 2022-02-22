const { response } = require('express');
const request = require('supertest')
const makeApp = require('./app.js');


const createUser = jest.fn()
const getUser = jest.fn()

const app = makeApp({
    createUser,
    getUser
})

describe("POST /users", () =>{

beforeEach(() =>{
    createUser.mockReset()
})

    describe("given a username and a password", () =>{

        it("Should save the username and password to the database", async () =>{

            const bodyData = [
                {username: "username1", password: "password1"},
                {username: "username2", password: "password2"},
                {username: "username3", password: "password3"},
            ]

            for(const body of bodyData){
                createUser.mockReset()
                await request(app).post("/users").send(body)
                expect(createUser.mock.calls.length).toBe(1)
                expect(createUser.mock.calls[0][0]).toBe(body.username)
                expect(createUser.mock.calls[0][1]).toBe(body.password)
            }
        });

        it("Should respond with a json object containing the user id", async () =>{
            for(let i = 0; i < 10; i++){
                createUser.mockReset()
                createUser.mockResolvedValue(i);
                const response = await request(app).post("/users").send({
                    username: 'username',
                    password: 'password'
                })
                console.log(response.body)
                expect(response.body.userId).toBe(i);
            }
        });
            


        it("Should respond with a 200 status code", async () =>{
            const response = await request(app).post("/users").send({
                username: 'username',
                password: 'password'
            })
            expect(response.statusCode).toBe(200);
        });

        it("Should specify json in the content type header", async () =>{
            const response = await request(app).post('/users').send({
                username: 'username',
                password: 'password'
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        });

        it("The response includes a userId", async () =>{
            createUser.mockReset()
            createUser.mockResolvedValue(1);
            const response = await request(app).post('/users').send({
                username: 'username',
                password: 'password'
            })
            expect(response.body.userId).toBeDefined()
        });


    });

    describe("when the username and password is missing from the call", () =>{
        it("Should respond with a status code of 400", async () =>{

            const bodyData = [
                {username: 'username'},
                {password: 'password'},
                {}
            ]
            for(const body of bodyData){
                const response = await request(app).post('/users').send(body)
                expect(response.statusCode).toBe(400);
            }

        });
    });
})