const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const JWTUser = require('./models/jwtUser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
    const email = 'superadmin@gmail.com';
    const password = 'admin123';
    const name = 'admin';
    const number = '00000000';

    try {
        let user = await JWTUser.findOne({ email });
        if (user) {
            console.log('Admin already exists');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed Password:', hashedPassword); // Log the hashed password

        user = new JWTUser({ name, email, number, password: hashedPassword });
        await user.save();
        console.log('Admin created');
    } catch (err) {
        console.error(err.message);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
