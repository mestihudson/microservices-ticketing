import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '@/app';

jest.setTimeout(30000);

declare global {
  function signin(email?: string, password?: string): Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async (
  email: string = 'test@test.com', password: string = 'password') => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
