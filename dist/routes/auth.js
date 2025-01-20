"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authController = __importStar(require("../controller/auth"));
// Create router
const router = express_1.default.Router();
// Set up rate limiter for OTP requests
const otpRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { message: 'Too many OTP requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});
// Define route for signup
router.post('/signup', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail(),
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 3, max: 150 }),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 8, max: 50 })
], authController.signup);
// Define route for OTP verification
router.post('/verifyOtp', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail(),
    (0, express_validator_1.body)('otp')
        .trim()
        .isLength({ min: 4, max: 4 })
], otpRateLimiter, authController.verifyOtp);
// Define route for login
router.post('/login', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 8, max: 50 })
], authController.login);
// Define route for password reset request
router.post('/resetPassword', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
], otpRateLimiter, authController.resetPassword);
// Define route for verifying reset password
router.post('/verifyResetPass', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail(),
    (0, express_validator_1.body)('otp')
        .trim()
        .isLength({ min: 4, max: 4 }),
    (0, express_validator_1.body)('newPass')
        .trim()
        .isLength({ min: 8, max: 50 })
], otpRateLimiter, authController.verifyResetPass);
// Define route for email reset request
router.post('/resetEmail', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail(),
    (0, express_validator_1.body)('newEmail')
        .trim()
        .isEmail()
], otpRateLimiter, (req, res, next) => authController.resetEmail(req, res, next));
// Define route for verifying reset email
router.post('/verifyResetEmail', [
    (0, express_validator_1.body)('newEmail')
        .trim()
        .isEmail(),
    (0, express_validator_1.body)('otp')
        .trim()
        .isLength({ min: 4, max: 4 })
], otpRateLimiter, (req, res, next) => authController.verifyResetEmail(req, res, next));
// Define route for OTP request
router.post('/reqOtp', [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
], otpRateLimiter, (req, res, next) => authController.reqOtp(req, res, next));
// Export the router
exports.default = router;
//# sourceMappingURL=auth.js.map