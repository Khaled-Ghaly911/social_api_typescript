"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLike = exports.addLike = exports.getLike = void 0;
const user_1 = require("../models/user");
const like_1 = require("../models/like");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getLike = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }
    const { postId } = req.body;
    try {
        const likes = await like_1.Like.findAll({ where: { postId: postId } });
        res.status(200).json({ message: "retrival done successfully", likes: likes });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "fetching failed!" });
    }
};
exports.getLike = getLike;
const addLike = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }
    const { postId, userId } = req.body;
    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (!token) {
                res.status(404).json({ message: "Token missing, authorization denied" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            console.log(userId);
            const user = await user_1.User.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: 'user not found!' });
            }
            const like = await like_1.Like.create({
                userId: userId,
                postId: postId
            });
            res.status(200).json({ message: "Like added successfully!", like: like });
        }
        else {
            res.status(400).json({ message: "user not found!" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Like adding failed!" });
    }
};
exports.addLike = addLike;
const removeLike = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }
    const { likeId } = req.body;
    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (!token) {
                res.status(404).json({ message: "Token missing, authorization denied" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            console.log(userId);
            const like = await like_1.Like.findOne({ where: { id: likeId } });
            if (!like) {
                res.status(400).json({ message: "like already removed" });
            }
            like.destroy();
            res.status(200).json({ message: "like removed successfully!" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Like removing failed!" });
    }
};
exports.removeLike = removeLike;
//# sourceMappingURL=like.js.map