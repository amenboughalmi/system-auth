const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const oauthConnection = mongoose.createConnection(process.env.MONGO_URI_OAUTH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const oauthUserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
});

module.exports = oauthConnection.model('OAuthUser', oauthUserSchema);
