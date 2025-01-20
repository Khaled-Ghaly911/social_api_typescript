
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as Associations from './models/index';
import bodyParser from 'body-parser'
import authRoutes from './routes/auth'
import { connectDB } from './util/sequelize'

const app = express();
app.use(bodyParser.json())

// import routes 
app.use('/auth', authRoutes);

connectDB()

app.listen(3000)
