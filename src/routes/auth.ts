import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import rateLimiter from 'express-rate-limit';
import * as authController from '../controller/auth';

// Create router
const router = express.Router();

// Set up rate limiter for OTP requests
const otpRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { message: 'Too many OTP requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Define route for signup
router.post('/signup', [
    body('email')
        .trim()
        .isEmail(),
    body('name')
        .trim()
        .isLength({ min: 3, max: 150 }),
    body('password')
        .trim()
        .isLength({ min: 8, max: 50 })
], authController.signup);

// Define route for OTP verification
router.post('/verifyOtp', [
    body('email')
        .trim()
        .isEmail(),
    body('otp')
        .trim()
        .isLength({ min: 4, max: 4 })
], otpRateLimiter,  authController.verifyOtp);

// Define route for login
router.post('/login', [
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({ min: 8, max: 50 })
],  authController.login);

// Define route for password reset request
router.post('/resetPassword', [
    body('email')
        .trim()
        .isEmail()
], otpRateLimiter,  authController.resetPassword);

// Define route for verifying reset password
router.post('/verifyResetPass', [
    body('email')
        .trim()
        .isEmail(),
    body('otp')
        .trim()
        .isLength({ min: 4, max: 4 }),
    body('newPass')
        .trim()
        .isLength({ min: 8, max: 50 })
], otpRateLimiter,  authController.verifyResetPass);

// Define route for email reset request
router.post('/resetEmail', [
    body('email')
        .trim()
        .isEmail(),
    body('newEmail')
        .trim()
        .isEmail()
], otpRateLimiter, (req: Request, res: Response, next: NextFunction) => authController.resetEmail(req, res, next));

// Define route for verifying reset email
router.post('/verifyResetEmail', [
    body('newEmail')
        .trim()
        .isEmail(),
    body('otp')
        .trim()
        .isLength({ min: 4, max: 4 })
], otpRateLimiter, (req: Request, res: Response, next: NextFunction) => authController.verifyResetEmail(req, res, next));

// Define route for OTP request
router.post('/reqOtp', [
    body('email')
        .trim()
        .isEmail()
], otpRateLimiter, (req: Request, res: Response, next: NextFunction) => authController.reqOtp(req, res, next));

// Export the router
export default router;
