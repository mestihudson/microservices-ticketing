import request from 'supertest';

import { app } from '@/app';

it('reponds with details about the current user', async () => {
  const email = 'test@test.com';
  const cookie = await signin(email);
  const response = await request(app)
    .get('/api/users/current')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual(email);
});

it('reponds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/current')
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
});
