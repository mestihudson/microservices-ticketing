import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

jest.setTimeout(30000);

declare global {
  function signin(email?: string, id?: string): string[];
}

if (!process.env.LOGGING_ENABLE) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.log = function () {};
}

jest.mock("@/nats-wrapper");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (email = "test@test.com", id = "user-id") => {
  // build a jwt payload. { id, email }
  const payload = { id, email };
  // create the jwt!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object. { jwt: MY_JWT }
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
