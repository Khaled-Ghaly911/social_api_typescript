"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("../models/user");
const post_1 = require("../models/post");
const comment_1 = require("../models/comment");
const like_1 = require("../models/like");
const follower_1 = require("../models/follower");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: 'E-Commerce',
    dialect: 'postgres',
    username: 'postgres',
    password: '123456',
    storage: ':memory:',
    models: [user_1.User, post_1.Post, comment_1.Comment, like_1.Like, follower_1.Follower],
    logging: false,
    host: 'localhost'
});
const connectDB = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('Database connected successfully');
        await exports.sequelize.sync({ alter: true }); // Sync database schema
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=sequelize.js.map