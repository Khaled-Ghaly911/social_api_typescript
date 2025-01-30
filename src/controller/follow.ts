import { Request, Response, NextFunction } from 'express';
import { Follower } from '../models/follower';
import { User } from '../models/user';

export const followUser = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
    const { followerId, followingId } = req.body;

    try {
        const follower = await User.findByPk(followerId);
        const following = await User.findByPk(followingId);

        if(!follower || !following) {
            res.status(404).json({message: 'user not found'});
            return;
        }

        const existingFollow = await Follower.findOne({ where: {followerId, followingId}})

        if(existingFollow) {
            res.status(400).json({message: 'Already following this user'});
            return;
        }

        await Follower.create({
            followerId,
            followingId
        })

        res.status(201).json({message: 'Successfully followed user'})

    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Internal server Error"});
    }
}

export const unfollowUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { followerId, followingId} = req.body;
    
    try {
        const result = await Follower.destroy({
            where:{followerId, followingId}
        })

        if(result === 0) {
            res.status(404).json({message: 'follow relationship not found'});
            return;
        }

        res.status(200).json({message: 'Successfully unfollowed user'})

    } catch (err) {
        console.error(err);
        res.status(500).json({message: ''})
    }
}

export const getFollowers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.params;

    try {
      const followers = await Follower.findAll({
        where: { followingId: userId },
        include: [{ model: User, as: 'follower' }],
      });

      res.status(200).json(followers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

  // Get users followed by a user
export const getFollowing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.params;

    try {
      const following = await Follower.findAll({
        where: { followerId: userId },
        include: [{ model: User, as: 'following' }],
      });

      res.status(200).json(following);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
