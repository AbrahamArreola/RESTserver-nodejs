const express = require('express');

const app = express();

app.use(require('./user_routes'));
app.use(require('./login'));
app.use(require('./categories_routes'));
app.use(require('../routes/product_routes'));

module.exports = app;