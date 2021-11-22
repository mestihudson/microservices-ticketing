import request from 'supertest';

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

it.todo('should return a status other than 401 if the user is signed in');
it.todo('should return an error if an titleId is not provided');
it.todo('should return an error if the ticket does not exist');
it.todo('should return an error if the ticket is already reserved');
it.todo('should reserve the ticket');
it.todo('should emit an event about created order');
