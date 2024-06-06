const JWTUser = require('../models/jwtUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const dotenv = require('dotenv');
const validator = require('validator');

dotenv.config();

exports.register = async (req, res) => {
    const { name, email, number, password } = req.body;

    // Input validation
    if (!name || !email || !number || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ msg: 'Name must contain only letters and spaces' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
    }

    if (!/^\d{8}$/.test(number)) {
        return res.status(400).json({ msg: 'Number must be 8 digits' });
    }

    try {
        let user = await JWTUser.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        user = new JWTUser({ name, email, number, password });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await JWTUser.findOne({ email });
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            // Check if the user is the admin
            if (email === 'superadmin@gmail.com') {
                return res.json({ token, redirectUrl: '/users' });
            }

            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};




exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        let user = await JWTUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        sendEmail(email, 'Password Reset Confirmation', 'Your password has been reset successfully.');
        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.sendResetCode = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await JWTUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        await user.save();

        sendEmail(email, 'Password Reset Code', `Your password reset code is ${resetCode}`);
        res.json({ msg: 'Reset code sent to email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
