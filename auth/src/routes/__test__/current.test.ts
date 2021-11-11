import request from 'supertest';

import { app } from '@/app';

it('reponds with details about the current user', async () => {
  const email = 'test@test.com'
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({ email, password: 'password' })
    .expect(201);
  const cookie = signupResponse.get('Set-Cookie');
  const response = await request(app)
    .get('/api/users/current')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual(email);
});
