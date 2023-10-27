const express = require('express');

const Auth = require('./app/middleware/Auth');

const UserController = require('./app/controller/UserController');
const TaskController = require('./app/controller/TaskController');
const AuthController = require('./app/controller/AuthController');
const CommentController = require('./app/controller/CommentController');


const router = express.Router();

//Login
router.post('/login', AuthController.login);
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
router.get('/task/:task_status', Auth, TaskController.indexStatus);
router.put('/task/:task_id', Auth, TaskController.update);
router.delete('/task/:task_id', Auth, TaskController.delete);


//task
router.post('/comm/:task_id', Auth, CommentController.store);
router.get('/comm/:task_id', Auth, CommentController.index);
router.put('/comm/:id', Auth, CommentController.update);
router.delete('/comm/:id', Auth, CommentController.delete);

//Recuperar senha
router.post('/forgot_password', AuthController.forgotPassword);
router.post('/recovery_password', AuthController.recoveryPassword);

module.exports = router;