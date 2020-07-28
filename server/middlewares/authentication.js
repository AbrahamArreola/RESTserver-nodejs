var jwt = require('jsonwebtoken');

//Middleware that verifies the json web token
let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    });
};

//Middleware that verifies if the user is an admin
let verifyAdmin = (req, res, next) => {

    if(req.user.role === "ADMIN_ROLE"){
        next();
    } else{
        return res.json({
            ok: false,
            err: {
                message: "The user is not an administrator"
            }
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
}