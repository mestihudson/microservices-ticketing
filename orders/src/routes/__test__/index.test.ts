import request from 'supertest';

import { app } from '@/app';

it('should have a route handler listening to /api/orders for get requests', async () => {
  const { status } = await request(app)
    .get('/api/orders')
    .send({});
  expect(status).not.toBe(404);
});

it('should can only be accessed if the user is signed in', async () => {
  await request(app)
    .get('/api/orders')
    .send({})
    .expect(401);
});

it('should return a status other than 401 if the user is signed in', async () => {
  const { status } = await request(app)
    .get('/api/orders')
    .set('Cookie', signin())
    .send({});
  expect(status).not.toBe(401);
});
it.todo('should fetch orders for an particular user');