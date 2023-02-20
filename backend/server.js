const express = require('express');
const app = express();
const port = 3001;
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');

require('dotenv').config();

app.use('/api/upload', require('./routes/upload'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app