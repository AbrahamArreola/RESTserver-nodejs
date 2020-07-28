//Imports port config
require('./config/config');

//Imports express module to raise the server
const express = require('express');

//Imports body-parser module to manage the payload as a json
const bodyParser = require('body-parser');

//Imports mongoose module to work with the NoSQL database MongoDB
const mongoose = require('mongoose');

const app = express();

//Necessary in order to work with body-parser module
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//Saves the port available to work with
app.set('port', process.env.PORT);

//Imports module user_routes which contains all the user http routes
app.use(require('./routes/index'));

//Necessary in order to work with mongoose
mongoose.set('useCreateIndex', true);

//Creating connection to mongoDB
mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    else console.log("Database connected");
});

//Runs the server on the configured port
app.listen(app.get('port'), () => {
    console.log(`Listening port ${app.get('port')}`);
});