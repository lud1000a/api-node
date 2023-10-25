const express = require('express');
const passport = require('passport');

const Auth = require('./app/middleware/Auth');

const UserController = require('./app/controller/UserController');
const TaskController = require('./app/controller/TaskController');

const router = express.Router();

//Login
router.post('/login', UserController.login);
//Register
router.post('/user', UserController.store);


//Autenticadas
//usuario
router.get('/user', Auth, UserController.show);
router.put('/user', Auth, UserController.update);
router.put('/user/password', Auth, UserController.updatePassword);
router.delete('/user', Auth, UserController.delete);

//task
router.post('/task', Auth, TaskController.store);
router.get('/task', Auth, TaskController.index);
router.put('/task/:task_id', Auth, TaskController.update);
router.delete('/task/:task_id', Auth, TaskController.delete);


module.exports = router;