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
  const orderId = new mongoose.Types.ObjectId().toHexString();

  it('should return 401 if it is not', async () => {
		await request(app)
			.get(`/api/orders/${orderId}`)
			.send({})
			.expect(401);
	});

  it('should return other than 401 if it is', async () => {
		const { status } = await request(app)
			.get(`/api/orders/${orderId}`)
      .set('Cookie', signin())
			.send({});
		expect(status).not.toBe(401);
  });
})

it.todo('should fetch the orders');
it.todo('should return 404 if the order does not exists');
it.todo('should return 401 if the order does not belong to user');
it.todo('should fetched order have be populated with the ticket');
