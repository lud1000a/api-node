const req = require('supertest');
const app = require('../server');
const connection = require('../database/index');

// afterAll(() => {
//     connection.close();
// });


describe("Register", () => {

    it("Should be possible to Create a new user if the email does not exist in bd", async () => {

        const res = await req(app).post("/user").send({
            name: "abcdefg",
            email: "abcdefg@gmail.com",
            password: "13424"
        }).set('Accept', 'application/json');

        expect(res.statusCode).toBe(201);
    });

    it("Should be not possible to Create a new user if no have one body or some one part", async () => {

        const res = await req(app).post("/user").send({
            name: "name",
            email: "",
            password: ""
        }).set('Accept', 'application/json');

        expect(res.statusCode).toBe(400);

    });

});

describe("Show", () => {

    it("The user should be able to view their information if authenticated", async () => {

        //logar com ele 
        const login = await req(app).post("/login").send({
            email: "abcdefg@gmail.com",
            password: "13424"
        }).set('Accept', 'application/json');

        expect(login.statusCode).toBe(200);

        const res = await req(app).get("/user").set({Authorization: login.body.token});

        expect(res.statusCode).toBe(200);

    });

});

describe("Update", () =>{

    it("The user can update their information if authenticated", async () => {

        const login = await req(app).post("/login").send({
            email: "abcdefg@gmail.com",
            password: "13424"
        }).set('Accept', 'application/json');
        
        expect(login.statusCode).toBe(200);

        const res = await req(app).put("/user").send({
            name: "retangulo"
        }).set({Authorization: login.body.token});

        expect(res.statusCode).toBe(201);
        
        const resPassword = await req(app).put("/user/password").send({
            newpassword: "1111"
        }).set({Authorization: login.body.token});

        expect(resPassword.statusCode).toBe(201);
    });

});

describe("Delete", () =>{

    it("The user can delete their account if authenticated", async () => {

        const login = await req(app).post("/login").send({
            email: "abcdefg@gmail.com",
            password: "1111"
        }).set('Accept', 'application/json');
        
        expect(login.statusCode).toBe(200);

        const res = await req(app).delete("/user").set({Authorization: login.body.token});

        expect(res.statusCode).toBe(200);
        
    });

});
