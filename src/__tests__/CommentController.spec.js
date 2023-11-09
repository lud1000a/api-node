const req = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const User = require('../app/models/User');
const Task = require('../app/models/Task');
let validToken= null;
let taskId = null;

beforeAll( async () => {

    const user = await User.create({ name:"test", email:"test2", password:"test" });
    const jwtToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET, {
        expiresIn: 86400,
    });

    const task = await Task.create({
        user_id : user.id,
        task : "teste task comentario",
        status : false
    });

    taskId= task.id
    validToken = jwtToken
});

describe("Create", () => {

    it("Should be possible to create a new comment if the user is authenticated and not exists whitespaces", async () => {

        const res = await req(app).post("/comm/"+taskId).send({
            comment: "test"
        }).set({Authorization: validToken});

        expect(res.statusCode).toBe(201);
        
    });

});

describe("Show", () => {

    it("Should be possible the user be able to view their comments if authenticated", async () => {

        const res = await req(app).get("/comm/-").set({Authorization: validToken});

        expect(res.statusCode).toBe(200);
        
    });

});

describe("Update", () => {

    it("Should be able the user to update their comment if authenticated", async () => {

        const res = await req(app).put("/comm/1").send({
            task: "mudança"
        }).set({Authorization: validToken});

        expect(res.statusCode).toBe(201);
        
    });

});

describe("Delete", () =>{

    it("Should be able the user to delete their comment if authenticated", async () => {

        const res = await req(app).delete("/comm/1").set({Authorization: validToken});

        expect(res.statusCode).toBe(200);
        
    });

});
