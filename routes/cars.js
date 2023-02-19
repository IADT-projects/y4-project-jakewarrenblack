const express = require('express');
const router = express.Router();

const imageUpload = require('../utils/image_upload');

const { 
    readData, 
    readOne,
    createData,
    updateData,
    deleteData
  } = require('../controllers/car_controller');

router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', imageUpload.single('image'), createData)
    .put('/:id', imageUpload.single('image'), updateData)
    .delete('/:id', deleteData);

module.exports = router;