const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const jwtUserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    number: { type: String, match: /^[0-9]+$/ },
    password: { type: String, required: true },
    resetCode: { type: String },
});

jwtUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('JWTUser', jwtUserSchema);
