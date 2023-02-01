import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import allRoutes from './routes/routes.js';
import error from './utils/createError.js';
import path from 'path';
const app = express();

const PORT = process.env.PORT || 8000;

// Adding middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
// app.use(express.static('client/dist'));

// All routes with an '/api' prefix
app.use('/api', allRoutes);

//Error handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error.';

  return res.status(status).json({ message, stack: error.stack });
});

mongoose.set('strictQuery', false);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve('../client', 'dist', 'index.html'));
  });
}

// Connection to database:
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
