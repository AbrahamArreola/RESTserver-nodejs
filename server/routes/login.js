const express = require('express');
const bcrypt = require('bcrypt');

//Import jsonwebtoken module which generates a json web token object to manage users' sessions
var jwt = require('jsonwebtoken');

const User = require('../models/users');

const app = express();

app.post('/login', function (req, res) {

    let body = req.body;

    User.findOne({
        email: body.email
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Incorrect user'
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Incorrect password'
            });
        }

        let token = jwt.sign({
            user: userDB,
        }, process.env.SEED, {expiresIn: process.env.TOKEN_EXPIRATION});

        res.json({
            ok: true,
            User: userDB,
            token
        });
    });
});

module.exports = app;