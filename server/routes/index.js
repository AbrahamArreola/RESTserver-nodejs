const express = require('express');

const app = express();

app.use(require('./user_routes'));
app.use(require('./login'));
app.use(require('./categories_routes'));
app.use(require('./product_routes'));
app.use(require('./upload'));
app.use(require('./images'));

module.exports = app;