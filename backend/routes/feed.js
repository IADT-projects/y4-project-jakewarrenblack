const express = require('express');
const router = express.Router();
const {sendFeed} = require('../controllers/feed_controller')

router.get("/", sendFeed)

module.exports = router;