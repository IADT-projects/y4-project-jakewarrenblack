const {S3} = require("@aws-sdk/client-s3");
const ID = process.env.MY_AWS_ACCESS_KEY_ID
const SECRET = process.env.MY_AWS_SECRET_ACCESS_KEY
const BUCKET = process.env.MY_AWS_BUCKET
const REGION = process.env.MY_AWS_REGION

// Initializing S3 Interface
const s3 = new S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: REGION
});

const imageUpload = (req, res) => {
    // The fileUpload middleware running in server.js lets us pull in a buffer representation of the image in req.files.foo.data
    const fileContent = Buffer.from(req.files.data.data, 'binary')

    // Providing AWS access credentials
    const params = {
        Bucket: BUCKET,
        Key: req.files.data.name,
        Body: fileContent
    }

    s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        }
        res.status(200).json({
            "response_data": data,
        })
    })
}

module.exports = {
    imageUpload
}