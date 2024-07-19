import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

let key = process.env.JWT_KEY;

const generateToken = (payload) => {
  const option = {
    expiresIn : '30d',
  }
  const token = jwt.sign(payload, key, option)
  return token
}

export default generateToken;