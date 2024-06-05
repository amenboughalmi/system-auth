const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectOauthDB = async () => {
    try {
        const oauthConnection = await mongoose.createConnection("mongodb://localhost:27017/oauth2_users", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('OAuth MongoDB connected');
        return oauthConnection;
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectOauthDB;
