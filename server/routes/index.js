const express = require('express');

const app = express();

app.use(require('./user_routes'));
app.use(require('./login'));

module.exports = app;