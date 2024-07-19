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

const allowedOrigins = ['http://localhost:5173', 'https://your-production-domain.com'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());

app.use(Router);

app.listen(port, ()=> {
  console.log(`Open in http://localhost:${port}`)
})

connectDB();