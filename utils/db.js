const mongoose = require('mongoose');

const connect = async () => {
    let db = null;

    const DB_ATLAS_URL = process.env['DB_ATLAS_URL']

    try {
        await mongoose.connect(`${DB_ATLAS_URL}/userData?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected successfully to db");
        db = mongoose.connection;
    }
    catch(error) {
        console.log(error);
    }
    finally {
        if(db !== null && db.readyState === 1) {
            // await db.close();
            // console.log("Disconnected successfully from db");
        }
    }
};

module.exports = connect;