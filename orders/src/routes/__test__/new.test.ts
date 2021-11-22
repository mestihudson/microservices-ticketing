import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/app';

it('should have a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({});
  expect(response.status).not.toBe(404);
});

it('should can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/orders')
    .send({})
    .expect(401);
});

it('should return a status other than 401 if the user is signed in', async () => {
  const { status } = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({});
  expect(status).not.toBe(401);
});

it('should return an error if an titleId is not provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({})
    .expect(400);
});

it('should return an error if the ticketId is not a valid id', async () => {
  const ticketId = 'ticketId';
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(400);
});

it('should return an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(404);
});

it.todo('should return an error if the ticket is already reserved');
it.todo('should reserve the ticket');
it.todo('should emit an event about created order');
