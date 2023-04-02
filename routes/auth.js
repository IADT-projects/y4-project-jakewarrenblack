const express = require('express');
const router = express.Router();
const {login, register, logout} = require('../controllers/auth_controller')

router
    .post("/login", login)
    .post("/register", register)
    .post("/logout", logout)

module.exports = router;