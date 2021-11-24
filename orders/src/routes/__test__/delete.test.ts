import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/app';

it('should have a route handler listening to /api/orders/:orderId for delete requests', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const { status } = await request(app)
    .delete(`/api/orders/${orderId}`)
    .send({});
  expect(status).not.toBe(404);
});

it('should return 401 if the user is not signed in', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .send({})
    .expect(401);
});

it('should return other than 401 if the user is signed in', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const { status } = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', signin())
    .send({});
  expect(status).not.toBe(401);
});

it.todo('should return 404 if the order does not exist');
it.todo('should update order status to cancelled');
it.todo('should return 401 if the order does not belong to user');
it.todo('should emit a cancelled order event');
