const express = require('express');
const router = express.Router();
const multer = require('multer')

const {imageUpload} = require('../utils/image_upload');

const upload = multer({
    storage: multer.memoryStorage(),
});

router.post("/", upload.single('image'), imageUpload)

module.exports = router;