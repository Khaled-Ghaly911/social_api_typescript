import express from 'express';
import * as followerController from '../controller/follow';

const router = express.Router();

router.post('/follow', followerController.followUser);

router.post('/unfollow', followerController.unfollowUser);

router.get('/followers/:userId', followerController.getFollowers);

router.get('/following/:userId', followerController.getFollowing);

export default router;