"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqOtp = exports.verifyResetEmail = exports.resetEmail = exports.verifyResetPass = exports.resetPassword = exports.verifyOtp = exports.login = exports.signup = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// import redis from 'redis';
const randomstring_1 = __importDefault(require("randomstring"));
const user_1 = require("../models/user");
require('dotenv').config();
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: 'redis://127.0.0.1:6379',
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
redisClient.connect(); // Connect asynchronously
async function storeOtp(email, otp) {
    try {
        await redisClient.setEx(email, 300, otp);
        console.log(`OTP stored in Redis for ${email}`);
    }
    catch (err) {
        console.error('Error storing OTP in Redis:', err);
        throw new Error('Failed to store OTP.');
    }
}
async function retrieveOtp(email) {
    try {
        const otp = await redisClient.get(email);
        return otp;
    }
    catch (err) {
        console.error('Error retrieving OTP from Redis:', err);
        throw new Error('Failed to retrieve OTP.');
    }
}
async function deleteOtp(email) {
    try {
        await redisClient.del(email);
    }
    catch (err) {
        console.error('Error deleting OTP from Redis:', err);
        throw new Error('Failed to delete OTP.');
    }
}
// Generating OTP function
function generateOTP() {
    return randomstring_1.default.generate({ length: 4, charset: 'numeric' });
}
const transporter = nodemailer_1.default.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
// Functions for sending emails
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error('Email Sending Failed');
    }
}
/////////////////////////////////////////// Route Logic
const signup = async (req, res, next) => {
    const { email, name, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const hashedPass = await bcryptjs_1.default.hash(password, 12);
        const otp = generateOTP();
        await storeOtp(email, otp);
        const newUser = await user_1.User.create({
            email: email,
            name: name,
            password: hashedPass,
        });
        await sendEmail(email, `OTP Verification`, `Your OTP is : ${otp}`);
        res.status(201).json({
            message: 'User created successfully! Check your email for verification.',
            userId: newUser.id,
        });
    }
    catch (err) {
        console.error(err);
        await deleteOtp(email);
        res.status(500).json({ message: 'User creation failed' });
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await user_1.User.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).json({ message: 'Invalid email or password.' });
            return;
        }
        let isVerified = user.isVerified;
        if (!isVerified) {
            res.status(400).json({ message: 'Account is not verified yet' });
        }
        const isAuthenticated = await bcryptjs_1.default.compare(password, user.password);
        const token = jsonwebtoken_1.default.sign({
            email: email,
            id: user.id,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        if (isAuthenticated) {
            res.status(200).json({
                message: 'Login successful!',
                token: token,
            });
        }
        else {
            res.status(400).json({ message: 'Password is incorrect!' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: `Login failed.` });
    }
};
exports.login = login;
const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const storedOtp = await retrieveOtp(email);
        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        await deleteOtp(email);
        const user = await user_1.User.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        if (user.isVerified) {
            res.status(200).json({ message: 'Email is already verified.' });
        }
        user.isVerified = true;
        await user.save();
        console.log('User is verified!');
        res.status(200).json({ message: 'Email verified successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Verification failed.' });
    }
};
exports.verifyOtp = verifyOtp;
const resetPassword = async (req, res, next) => {
    const { email } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await user_1.User.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).json({ message: 'User not found!' });
        }
        const otp = generateOTP();
        await storeOtp(email, otp);
        await sendEmail(email, 'Password Reset OTP', `Your OTP is : ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send reset OTP' });
    }
};
exports.resetPassword = resetPassword;
const verifyResetPass = async (req, res, next) => {
    const { email, otp, newPass } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const storedOtp = await retrieveOtp(email);
        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        await deleteOtp(email);
        const user = await user_1.User.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        }
        const hashedPass = await bcryptjs_1.default.hash(newPass, 12);
        await user_1.User.update({ password: hashedPass }, { where: { email: email } });
        res.status(200).json({ message: 'Password updated successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Password reset failed.' });
    }
};
exports.verifyResetPass = verifyResetPass;
const resetEmail = async (req, res, next) => {
    const { newEmail, email } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        if (!email || !newEmail) {
            res.status(404).json({ message: 'Both current and new email addresses are required.' });
        }
        const user = await user_1.User.findOne({ where: { email: email } });
        if (!user) {
            res.status(404).json({ message: 'User not found!' });
            return;
        }
        user.email = newEmail;
        user.isVerified = false;
        await user.save();
        const otp = generateOTP();
        await storeOtp(newEmail, otp);
        await sendEmail(newEmail, 'Email Reset Verification', `Your OTP is: ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to reset email.' });
    }
};
exports.resetEmail = resetEmail;
const verifyResetEmail = async (req, res, next) => {
    const { newEmail, otp } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const storedOtp = await retrieveOtp(newEmail);
        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        await deleteOtp(newEmail);
        const user = await user_1.User.findOne({ where: { email: newEmail } });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: `Account's email changed successfully.` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to verify email reset.' });
    }
};
exports.verifyResetEmail = verifyResetEmail;
const reqOtp = async (req, res, next) => {
    const { email } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        if (!email) {
            res.status(400).json({ message: 'Email is required to request OTP.' });
        }
        const otp = generateOTP();
        await storeOtp(email, otp); // Passing OTP as parameter to store it
        await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};
exports.reqOtp = reqOtp;
// The remaining functions (verifyResetPass, resetEmail, etc.) follow a similar pattern
//# sourceMappingURL=auth.js.map