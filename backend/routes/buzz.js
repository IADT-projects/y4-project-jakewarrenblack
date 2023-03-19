const express = require('express');
const router = express.Router();
const {buzz} = require('../controllers/buzz_controller')

router.get("/", buzz)

module.exports = router;