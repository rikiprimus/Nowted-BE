import mongoose from 'mongoose';

const connectDB = async () => {
  console.log('MongoDB loading to connect')
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.log('MongoDB connection failed :')
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;