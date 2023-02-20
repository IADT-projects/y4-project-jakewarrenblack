const express = require('express');
const router = express.Router();

const {imageUpload} = require('../utils/image_upload');

router.post("/", imageUpload)

module.exports = router;