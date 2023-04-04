const bcrypt = require('bcryptjs')
const User = require('../models/user_schema')
const jwt = require('jsonwebtoken')
const passport = require("passport");

const register = (req, res) => {
    User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            res.json({ success: false, message: "Your account could not be saved. Error: " + err });
        }
        else {
            req.login(user, (err) => {
                if (err) {
                    res.json({ success: false, message: err });
                }
                else {
                    res.json({ success: true, message: "Your account has been saved" });
                }
            })
        }
    });
};



const login = (req, res) => {
    if (!req.body.username) {
        res.json({ success: false, message: "Username was not given" })
    }
    else if (!req.body.password) {
        res.json({ success: false, message: "Password was not given" })
    }
    else {
        passport.authenticate("local", function (err, user, info) {
            if (err) {
                res.json({ success: false, message: err });
            }
            else {
                if (!user) {
                    res.json({ success: false, message: "username or password incorrect" });
                }
                else {
                    const token = jwt.sign({ userId: user._id, username: user.username }, process.env['APP_KEY'], { expiresIn: "24h" });
                    res.status(200).json({ success: true, message: "Authentication successful", token: token });
                }
            }
        })(req, res);
    }

};

const logout = (req, res) => {
    req.logout()

    res.status(200).json({
        msg: 'logged out'
    })


}


const getUser = (req, res) => {
    if(req.user){
        res.status(200).json({
            msg: req.user
        })
    }
    else{
        res.status(500).json({
            msg: 'No user in the session'
        })
    }
}



module.exports = {
    login,
    register,
    logout,
    getUser
}