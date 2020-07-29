const express = require('express');
const bcrypt = require('bcrypt');

//Import jsonwebtoken module which generates a json web token object to manage users' sessions
var jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        }, process.env.SEED, {
            expiresIn: process.env.TOKEN_EXPIRATION
        });

        res.json({
            ok: true,
            User: userDB,
            token
        });
    });
});

//Google configuration
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/login-google', async function (req, res) {

    let token = req.body.idtoken;

    try{
        var googleUser = await verify(token);

    } catch(err){
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Invalid token'
            }
        });
    }

    User.findOne({email: googleUser.email}, (err, userDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(userDB){
            if(!userDB.google){
                return res.status(400).json({
                    ok: false,
                    message: 'You must use your normal authentication'
                });
            }else{
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, {expiresIn: process.env.TOKEN_EXPIRATION});
    
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else{
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.google = true;
            user.password = bcrypt.hashSync("google-password", 10);

            user.save((err, userDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDB,
                }, process.env.SEED, {
                    expiresIn: process.env.TOKEN_EXPIRATION
                });
        
                res.json({
                    ok: true,
                    User: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;