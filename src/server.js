const express = require('express');
const routes = require('./routes');
require('dotenv').config();

require('./database/index');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`Server runnig or port ${PORT}`));