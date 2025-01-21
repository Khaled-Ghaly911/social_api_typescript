"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.getComments = void 0;
const user_1 = require("../models/user");
const comment_1 = require("../models/comment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getComments = async (req, res, next) => {
    const { postId } = req.body;
    try {
        const comments = await comment_1.Comment.findAll({ where: { postId: postId } });
        if (comments.length === 0) {
            res.status(200).json({ message: 'No Comments.', comments: comments });
            return;
        }
        res.status(200).json({ message: 'Comments fetched successfully.', comments: comments });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'fetching comments failed!' });
    }
};
exports.getComments = getComments;
const createComment = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }
    const { guestEmail, content, postId, guestName } = req.body;
    try {
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Token missing, authorization denied" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
            const userId = decoded.id;
            console.log(userId);
            const user = await user_1.User.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found" });
            }
            const author = user.name;
            const comment = await comment_1.Comment.create({
                author,
                content,
                email,
                postId,
                fromGuest: false,
            });
            res.status(200).json({ message: "Comment created successfully for a user!", comment });
        }
        else {
            const author = guestName;
            const comment = await comment_1.Comment.create({
                author,
                content,
                email: guestEmail,
                postId,
                fromGuest: true,
            });
            res.status(200).json({ message: "Comment created successfully for a guest!", comment });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Comment creation failed!" });
    }
};
exports.createComment = createComment;
//# sourceMappingURL=comment.js.map