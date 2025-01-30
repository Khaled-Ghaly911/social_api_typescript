"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const follower_1 = require("../models/follower");
const user_1 = require("../models/user");
const followUser = async (req, res, next) => {
    const { followerId, followingId } = req.body;
    try {
        const follower = await user_1.User.findByPk(followerId);
        const following = await user_1.User.findByPk(followingId);
        if (!follower || !following) {
            res.status(404).json({ message: 'user not found' });
            return;
        }
        const existingFollow = await follower_1.Follower.findOne({ where: { followerId, followingId } });
        if (existingFollow) {
            res.status(400).json({ message: 'Already following this user' });
            return;
        }
        await follower_1.Follower.create({
            followerId,
            followingId
        });
        res.status(201).json({ message: 'Successfully followed user' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server Error" });
    }
};
exports.followUser = followUser;
const unfollowUser = async (req, res, next) => {
    const { followerId, followingId } = req.body;
    try {
        const result = await follower_1.Follower.destroy({
            where: { followerId, followingId }
        });
        if (result === 0) {
            res.status(404).json({ message: 'follow relationship not found' });
            return;
        }
        res.status(200).json({ message: 'Successfully unfollowed user' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: '' });
    }
};
exports.unfollowUser = unfollowUser;
const getFollowers = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const followers = await follower_1.Follower.findAll({
            where: { followingId: userId },
            include: [{ model: user_1.User, as: 'follower' }],
        });
        res.status(200).json(followers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFollowers = getFollowers;
// Get users followed by a user
const getFollowing = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const following = await follower_1.Follower.findAll({
            where: { followerId: userId },
            include: [{ model: user_1.User, as: 'following' }],
        });
        res.status(200).json(following);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFollowing = getFollowing;
//# sourceMappingURL=follow.js.map