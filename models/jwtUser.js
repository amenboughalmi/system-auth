const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const jwtUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z\s]+$/.test(v); // Ensure the name contains only letters and spaces
            },
            message: props => `${props.value} is not a valid name! Names must contain only letters and spaces.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v); // Validate email format
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    number: {
        type: String,
        required: true,
        match: [/^\d{8}$/, 'Number must be 8 digits'] // Ensure the number is exactly 8 digits
    },
    password: {
        type: String,
        required: true
    },
    resetCode: {
        type: String
    }
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

