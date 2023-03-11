const { v4: uuidv4 } = require('uuid');
const qr = require('qrcode')


const generateQRCode = (req, res) => {
    // Generate a unique code
    const uuid = uuidv4();

    // Generate a QR code
    qr.toDataURL(uuid, (err, url) => {
        if (err) {
            console.error(err);
            return;
        }

        // Send the code to the frontend as a QR code
        res.send(url)
    });


    

}


module.exports = {
    generateQRCode,
};
