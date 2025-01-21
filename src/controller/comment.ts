import { User } from '../models/user';
import { Comment } from '../models/comment';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response} from 'express'
import { promises } from 'dns';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { postId } = req.body;
    try {
        const comments: Comment[] = await Comment.findAll({where: {postId: postId}});
        if(comments.length === 0) {
            res.status(200).json({ message: 'No Comments.', comments: comments });
            return;
        }

        res.status(200).json({message: 'Comments fetched successfully.', comments: comments});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: 'fetching comments failed!'});
    }
}

interface CustomJwtPayload extends JwtPayload {
    email: string;
    id: number;
}

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const errors = validationResult(req);

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

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

            const email = decoded.email;
            const userId = decoded.id;
            console.log(userId);

            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found" });
            }

            const author = user.name;
            const comment = await Comment.create({
                author,
                content,
                email,
                postId,
                fromGuest: false,
            });

            res.status(200).json({ message: "Comment created successfully for a user!", comment });
        } else {
            const author = guestName;
            const comment = await Comment.create({
                author,
                content,
                email: guestEmail,
                postId,
                fromGuest: true,
            });

            res.status(200).json({ message: "Comment created successfully for a guest!", comment });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Comment creation failed!" });
    }
};
