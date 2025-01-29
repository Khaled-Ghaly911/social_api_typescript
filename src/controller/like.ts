import { User } from '../models/user';
import { Like } from '../models/like';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response} from 'express'
import { promises } from 'dns';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { where } from 'sequelize';
dotenv.config();

interface CustomJwtPayload extends JwtPayload {
    email: string;
    id: number;
}

export const getLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }

    const { postId } = req.body;
    
    try {
        const likes = await Like.findAll({where: { postId: postId }});
        res.status(200).json({message: "retrival done successfully", likes: likes});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "fetching failed!" });
    }
}

export const addLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }

    const { postId, userId} = req.body;

    try {
        if(authHeader) {
            const token = authHeader.split(' ')[1];
            if(!token) {
                res.status(404).json({message: "Token missing, authorization denied"});
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
            
            const userId = decoded.id;
            console.log(userId);

            const user = await User.findOne({ where: { id: userId}});
            if(!user) {
                res.status(404).json({message: 'user not found!'});
            }

            const like = await Like.create({
                userId: userId,
                postId: postId
            });

            res.status(200).json({message: "Like added successfully!", like: like});
        } else {
            res.status(400).json({message: "user not found!"});
        }
    } catch (err){
        console.error(err);
        res.status(500).json({ message: "Like adding failed!" });
    }
}

export const removeLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation errors", errors: errors.array() });
    }

    const { likeId } = req.body;

    try {
        if(authHeader) {
            const token = authHeader.split(' ')[1];
            if(!token) {
                res.status(404).json({message: "Token missing, authorization denied"});
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
            
            const userId = decoded.id;
            console.log(userId);

            const like = await Like.findOne({where: { id: likeId }});

            if(!like) {
                res.status(400).json({message: "like already removed"});
            }

            like.destroy();
            res.status(200).json({ message: "like removed successfully!"} );
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Like removing failed!" });
    }
}