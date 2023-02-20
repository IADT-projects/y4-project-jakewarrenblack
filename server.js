const express = require('express');
const app = express();
const port = 3000;
const fileUpload = require('express-fileupload')

// Using fileUpload middleware
app.use(fileUpload(undefined))

require('dotenv').config();

app.use('/api/upload', require('./routes/upload'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app