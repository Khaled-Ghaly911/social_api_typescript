import express from "express";
import { body } from "express-validator";
import * as likeController from "../controller/like";

const router = express.Router();

router.get('/getLike', likeController.getLike);

router.post('/addLike', likeController.addLike);

router.post('/removeComment', likeController.removeLike);

export default router;