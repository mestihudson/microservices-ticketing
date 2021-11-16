import request from 'supertest';

import { app } from '@/app';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

describe('returns an error if an invalid title is provided', () => {
  it.each([{ title: '' }, {}])
    ('provided title: [%s]',
    async (providedTitle) => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({ ...providedTitle, price: 10 })
      .expect(400);
  });
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'dsfjapsodf',
      price: -10
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'dsfjapsodf',
      price: 0
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'dsfjapsodf'
    })
    .expect(400);
});

it('create a ticket with valid inputs', async () => {});
