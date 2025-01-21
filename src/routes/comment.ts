import express from "express";
import { body } from "express-validator";
import * as commentsController from "../controller/comment";

const router = express.Router();

router.get("/comments", commentsController.getComments);

router.post(
    "/createComment",
    [
        body("content").trim().isLength({ min: 5, max: 500 }),
    ],
    commentsController.createComment
);

export default router;
