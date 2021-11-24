import request from 'supertest';

import { app } from '@/app';

it('should have a route handler listening to /api/orders for get requests', async () => {
  const { status } = await request(app)
    .get('/api/orders')
    .send({});
  expect(status).not.toBe(404);
});

it.todo('should can only be accessed if the user is signed in');
it.todo('should return a status other than 401 if the user is signed in');
it.todo('should fetch orders for an particular user');
