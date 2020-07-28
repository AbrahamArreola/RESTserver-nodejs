const express = require('express');

//Imports bcrypt module which contains functions to crypt strings like passwords
const bcrypt = require('bcrypt');

//Imports underscore module which we can filter the fields in a json to only work with the selected ones
const _ = require('underscore');

//Creates a User model object defined in that file
const User = require('../models/users');
const {verifyToken, verifyAdmin} = require('../middlewares/authentication');

const app = express();

//Defines a route to make get requests to response with all the users
app.get('/user', verifyToken, function (req, res) {

    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 10;

    User.find({
            status: true
        })
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({
                status: true
            }, (error, total) => {
                res.json({
                    ok: true,
                    user: users,
                    count: total
                });
            });
        });
});

//Defines a route to make post requests to save users' data
app.post('/user', [verifyToken, verifyAdmin], function (req, res) {

    //Gets payload data in a json format
    let body = req.body;

    //Creates an instance of user model to save registers in the database according to that model
    let user = new User({
        name: body.name,
        email: body.email,
        //crypts the password with bcrypt
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    //Executes a query which saves in the DB the data sent and executes a callback with the response
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

//Defines a route to make put requests to update user's data
app.put('/user/:id', [verifyToken, verifyAdmin], function (req, res) {

    //Gets id passed by url and stores it in a variable
    let id = req.params.id;

    //Creates the new json body filtering only the fields we want to work with
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    //Executes a query which search in the DB the requested id's data and if it's found, replaces the data with the new one, then
    //executes a callback with the response
    User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', [verifyToken, verifyAdmin], function (req, res) {

    let id = req.params.id;

    let stateChanged = {
        status: false
    };

    //User.findByIdAndRemove(id, (err, deletedUser) => {
    User.findByIdAndUpdate(id, stateChanged, {
        new: true
    }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            });
        }

        res.json({
            ok: true,
            deletedUser
        });
    });
});

module.exports = app;