import { sequelize } from '../util/sequelize';
import { User } from './user';
import { Post } from './post';
import { Comment } from './comment';
import { Like } from './like';
import { Follower } from './follower';

// Associations
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(User, { through: Follower, as: 'Followers', foreignKey: 'followerId' });
User.belongsToMany(User, { through: Follower, as: 'Following', foreignKey: 'followingId' });

User.belongsToMany(Post, { through: Like, foreignKey: 'userId' });
Post.belongsToMany(User, { through: Like, foreignKey: 'postId' });

export { User, Post, Comment, Like, Follower };
