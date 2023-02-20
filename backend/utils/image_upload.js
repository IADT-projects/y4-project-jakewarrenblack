const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const ID = process.env.MY_AWS_ACCESS_KEY_ID
const SECRET = process.env.MY_AWS_SECRET_ACCESS_KEY
const BUCKET = process.env.MY_AWS_BUCKET
const REGION = process.env.MY_AWS_REGION

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ID,
        secretAccessKey: SECRET
    },
});

const imageUpload = async (req, res) => {
    const imageBuffer = req.file.buffer;

    // Set up the S3 upload parameters
    const uploadParams = {
        Bucket: BUCKET,
        Key: 'image.png',
        Body: imageBuffer,
        ContentType: 'image/png',
    };

    // Create a new S3 command to put the object in S3
    const putObjectCommand = new PutObjectCommand(uploadParams);

    // Upload the file to S3
    await s3Client.send(putObjectCommand)
        .then((response) => {
            console.log(`Successfully uploaded to S3}`);
            res.status(200).json({
                'msg': 'success'
            })
        })
        .catch((error) => {
            console.log(`Error uploading to S3}`);
            res.status(500).json({
                'msg': 's3 upload failed'
            })
        });
}

module.exports = {
    imageUpload
}