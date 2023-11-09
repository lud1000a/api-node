const req = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const Task = require('../app/models/Task');
const User = require('../app/models/User');
let validToken= null;
let taskId = null;

beforeAll( async () => {

    const user = await User.create({ name:"test", email:"test", password:"test" });
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

    it("Should be possible to create a new task if the user is authenticated and not exists whitespaces", async () => {

        const res = await req(app).post("/task").send({
            task: "test"
        }).set({Authorization: validToken});

        expect(res.statusCode).toBe(201);
        
    });

});

describe("Show", () => {

    it("Should be possible the user be able to view their tasks if authenticated", async () => {

        const res = await req(app).get("/task/-").set({Authorization: validToken});

        expect(res.statusCode).toBe(200);
        
    });

});

describe("Update", () => {

    it("Should be able the user to update their tasks if authenticated", async () => {

        //se não for passado nenhum body a task so mudara de status
        const res = await req(app).put("/task/"+taskId).send({
            task: "mudança"
        }).set({Authorization: validToken});

        expect(res.statusCode).toBe(201);
        
    });

});

describe("Delete", () =>{
    
    it("Should be able the user to delete their tasks if authenticated", async () => {

        const res = await req(app).delete("/task/"+taskId).set({Authorization: validToken});

        expect(res.statusCode).toBe(200);
        
    });

});
