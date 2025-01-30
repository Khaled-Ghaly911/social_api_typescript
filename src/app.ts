
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as Associations from './models/index';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import commentRoutes from './routes/comment';
import likeRoutes from './routes/like';
import postRoutes from './routes/post';
import followRoutes from './routes/follow'
import { connectDB } from './util/sequelize'
import {} from './models/index';
import sequelize from 'sequelize';

const app = express();
app.use(bodyParser.json())

// import routes 
app.use('/auth', authRoutes);
app.use('/comment', commentRoutes);
app.use('/follow', followRoutes);
app.use('/like', likeRoutes);
app.use('/post', postRoutes);


connectDB()

app.listen(3000)
