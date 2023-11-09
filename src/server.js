const express = require('express');
const routes = require('./routes');
require('dotenv').config();

require('./database/index');

const app = express();

app.use(express.json());
app.use(routes);

if ( process.env.DB_NAME === "test"){

}else{
    const PORT = process.env.PORT;
    app.listen(PORT);
}

module.exports = app