const req = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//criando um usuario aleatorio 
const char = 'ABCDEfghijKLMN1234567OPQRStuvWX';
var stringAleatoria = '';

for(var i = 0; i < 7; i++){
    stringAleatoria += char.charAt(Math.floor(Math.random() * char.length));
}


describe("Login", () => {

    it("Login should not be possible if there is a whitespace or if the user not exist", async () => {

        const res = await req(app).post("/login").send({
            email: "abcd@gmail.com",
            password: ""
        }).set('Accept', 'application/json');

        expect(res.statusCode).toBe(400);

    });

    it("Login should be possible if the credentials they are correct and if the JWT token is created and validated for middleware", async () => {

        //criar esse usuario no banco de dados
        const user = await req(app).post("/user").send({
            name: "test",
            email: stringAleatoria,
            password: "13424"
        }).set('Accept', 'application/json');

        expect(user.statusCode).toBe(201);

        //logar com ele 
        const res = await req(app).post("/login").send({
            email: stringAleatoria,
            password: "13424"
        }).set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        //verificar se o token é valido
        const token = res.body.token

        const verification = jwt.verify(token.replace('Bearer ', ""), process.env.JWT_SECRET);

        expect(verification).toBeTruthy();

    });

});

describe("Recovery Password", () =>{

    it("Should be possible to request a password recovery token if the credentials are correct", async () => {

        const res = await req(app).post("/forgot_password").send({
            email: stringAleatoria
        }).set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);

    });
    
});

