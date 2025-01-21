"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = exports.getPosts = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const post_1 = require("../models/post");
const getPosts = async (req, res, next) => {
    const userId = req.user?.id;
    let posts;
    try {
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const user = await user_1.User.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        if (!user.isVerified) {
            posts = await post_1.Post.findAll({ where: { isPublic: true } });
            res.status(200).json({ message: "Posts downloaded successfully", posts });
        }
        else {
            posts = await post_1.Post.findAll();
            res.status(200).json({ message: "Posts downloaded successfully", posts });
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: "Failed to get posts" });
    }
};
exports.getPosts = getPosts;
const createPost = async (req, res, next) => {
    const userId = req.user?.id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }
    const { title, content, isPublic } = req.body;
    try {
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const user = await user_1.User.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        if (!user.isVerified) {
            res.status(401).json({ message: "User is not verified" });
        }
        const author = user.name;
        const post = await post_1.Post.create({
            title,
            content,
            isPublic,
            author,
            userId: user.id,
        });
        res.status(201).json({ message: "Post created successfully!", post });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error occurred" });
    }
};
exports.createPost = createPost;
//# sourceMappingURL=post.js.map