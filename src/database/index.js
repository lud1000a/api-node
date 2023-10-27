const Sequelize =  require('sequelize');
const dbConfig =  require('../config/database');

const User = require('../app/models/User');
const Task = require('../app/models/Task');
const Comment = require('../app/models/Comment');

const connection = new Sequelize(dbConfig);

User.init(connection);
Task.init(connection);
Comment.init(connection);

User.associate(connection.models);
Task.associate(connection.models);
Comment.associate(connection.models);

module.exports = connection;