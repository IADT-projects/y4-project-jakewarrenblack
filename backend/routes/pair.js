const express = require('express');
const router = express.Router();
const {generateQRCode} = require('../controllers/pair_controller')

router.get("/", generateQRCode)

module.exports = router;