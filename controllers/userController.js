const JWTUser = require('../models/jwtUser');
const OAuthUser = require('../models/oauthUser');

exports.getAllUsers = async (req, res) => {
    try {
        const jwtUsers = await JWTUser.find({});
        const oauthUsers = await OAuthUser.find({});

        res.json({ jwtUsers, oauthUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
