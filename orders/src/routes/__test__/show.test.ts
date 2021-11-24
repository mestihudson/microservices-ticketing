import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/app';

it('should have a route handler listening to /api/orders/:orderId for get requests', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const { status } = await request(app)
    .get(`/api/orders/${orderId}`)
    .send({});
  expect(status).not.toBe(404);
});

describe('can only be accessed if the user is signed in', () => {
  it.todo('should return 401 if it is not');
  it.todo('should return other then 401 if it is');
})
it.todo('should fetch the orders');
it.todo('should fetched order have be populated with the ticket');
