const express = require('express')
const app = express();
require('./db/mongoose');
const bodyParser = require('body-parser')
const Users = require('./db/models/user');
const taskdata = require('./db/Routers/task');
const userdata = require('./db/Routers/user')
const port = process.env.PORT;

app.use(express.json());
app.use(taskdata,bodyParser.json());
app.use(userdata);



app.listen(port, () => {
    console.log("Connection Done on Port: " + port)
})

