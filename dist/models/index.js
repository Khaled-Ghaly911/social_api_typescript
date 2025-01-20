"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follower = exports.Like = exports.Comment = exports.Post = exports.User = void 0;
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const post_1 = require("./post");
Object.defineProperty(exports, "Post", { enumerable: true, get: function () { return post_1.Post; } });
const comment_1 = require("./comment");
Object.defineProperty(exports, "Comment", { enumerable: true, get: function () { return comment_1.Comment; } });
const like_1 = require("./like");
Object.defineProperty(exports, "Like", { enumerable: true, get: function () { return like_1.Like; } });
const follower_1 = require("./follower");
Object.defineProperty(exports, "Follower", { enumerable: true, get: function () { return follower_1.Follower; } });
// Associations
user_1.User.hasMany(post_1.Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
post_1.Post.belongsTo(user_1.User, { foreignKey: 'userId' });
post_1.Post.hasMany(comment_1.Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
comment_1.Comment.belongsTo(post_1.Post, { foreignKey: 'postId' });
user_1.User.hasMany(comment_1.Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
comment_1.Comment.belongsTo(user_1.User, { foreignKey: 'userId' });
user_1.User.belongsToMany(user_1.User, { through: follower_1.Follower, as: 'Followers', foreignKey: 'followerId' });
user_1.User.belongsToMany(user_1.User, { through: follower_1.Follower, as: 'Following', foreignKey: 'followingId' });
user_1.User.belongsToMany(post_1.Post, { through: like_1.Like, foreignKey: 'userId' });
post_1.Post.belongsToMany(user_1.User, { through: like_1.Like, foreignKey: 'postId' });
//# sourceMappingURL=index.js.map