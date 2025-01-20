import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { Like } from '../models/like';
import { Follower } from '../models/follower';

export const sequelize = new Sequelize({
  database: 'E-Commerce',
  dialect: 'postgres',  
  username: 'postgres',
  password: '123456',
  storage: ':memory:', 
  models: [User, Post, Comment, Like, Follower], 
  logging: false,
  host: 'localhost'
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true }); // Sync database schema
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

