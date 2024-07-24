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

const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus:200
};


app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());

app.use(Router);

app.listen(port, ()=> {
  console.log(`Open in http://localhost:${port}`)
})

connectDB();