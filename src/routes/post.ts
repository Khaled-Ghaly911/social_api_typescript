import express from "express";
import { body } from "express-validator";
import isAuth from "../middleware/is-auth";
import * as postController from "../controller/post";

const router = express.Router();

router.get("/posts", postController.getPosts);

router.post(
    "/createPost",
    [
        body("title").trim().isLength({ min: 3, max: 150 }),
        body("content").trim().isLength({ min: 8, max: 5000 }),
        body("isPublic").isBoolean(),
    ],
    isAuth,
    postController.createPost
);

export default router;
