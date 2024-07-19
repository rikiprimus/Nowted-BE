import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import Router from './src/routes/index.js';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// const allowedOrigins = ['http://localhost:5173', 'http://localhost:5173/home', 'https://nowted-app-six.vercel.app'];

// const corsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());

app.use(Router);

app.listen(port, ()=> {
  console.log(`Open in http://localhost:${port}`)
})

connectDB();