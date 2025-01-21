import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { Post } from "../models/post";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export const getPosts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    let posts;

    try {
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            posts = await Post.findAll({ where: { isPublic: true } });
            res.status(200).json({ message: "Posts downloaded successfully", posts });
        } else {
            posts = await Post.findAll();
            res.status(200).json({ message: "Posts downloaded successfully", posts });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Failed to get posts" });
    }
};

export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }

    const { title, content, isPublic } = req.body;

    try {
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            res.status(401).json({ message: "User is not verified" });
        }

        const author = user.name;
        const post = await Post.create({
            title,
            content,
            isPublic,
            author,
            userId: user.id,
        });

        res.status(201).json({ message: "Post created successfully!", post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error occurred" });
    }
};
