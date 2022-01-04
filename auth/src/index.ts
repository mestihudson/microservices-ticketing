import mongoose from 'mongoose';

import { app } from '@/app';

const start = async () => {
  console.log("Starting up...");

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be setted');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be setted');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on 3000!')
  });
};

start();
