import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/app';
import { Ticket } from '@/models/ticket';

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
});

it('should return 404 if the order does not exist', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.get(`/api/orders/${orderId}`)
		.set('Cookie', signin())
		.send({})
		.expect(404);
});

it.todo('should return 401 if the order does not belong to user');

it('should fetch the order', async () => {
  const ticket = Ticket.build({
		title: 'concert',
		price: 20
	});
	await ticket.save();

	const user = signin();
	const { body: order } = await request(app)
	  .post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id})
		.expect(201);

	const response = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send({})
		.expect(200);
	expect(response.body).toMatchObject(expect.objectContaining({ id: order.id }));
});

it('should fetched order have be populated with the ticket', async () => {
  const ticket = Ticket.build({
		title: 'concert',
		price: 20
	});
	await ticket.save();

	const user = signin();
	const { body: order } = await request(app)
	  .post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id})
		.expect(201);

	const response = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send({})
		.expect(200);
	expect(response.body).toMatchObject(
		expect.objectContaining({
			ticket: expect.objectContaining({ id: ticket.id })
		})
	);
});
