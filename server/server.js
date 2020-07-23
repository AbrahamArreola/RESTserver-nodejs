require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.set('port', process.env.PORT);

app.get('/', function (req, res) {
    res.send('Hello World')
});

app.post('/user', function (req, res) {
    let body = req.body;

    res.json({
        body
    });
});

app.listen(app.get('port'), () => {
    console.log(`Listening port ${app.get('port')}`);
});