require('dotenv').config();
module.exports = {
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME === "test" ? "syscondom_test" : process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true,

    },
};

