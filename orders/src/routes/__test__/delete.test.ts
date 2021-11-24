import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/app';
import { Ticket } from '@/models/ticket';
import { OrderStatus } from '@mestihudson-ticketing/common';

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

it('should return 404 if the order does not exist', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const { status } = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', signin())
    .send({});
  expect(status).toBe(404);
});

it('should update order status to cancelled', async () => {
	const ticket = await Ticket.build({ title: 'concert', price: 20 });
	ticket.save();

	const { body: order } = await request(app)
	  .post('/api/orders')
		.set('Cookie', signin())
		.send({ ticketId: ticket.id })
		.expect(201);

	const { body: updated } = await request(app)
	  .delete(`/api/orders/${order.id}`)
		.set('Cookie', signin())
		.send({})
		.expect(200);
	expect(updated.status).toBe(OrderStatus.Cancelled);
});

it.todo('should return 401 if the order does not belong to user');
it.todo('should emit a cancelled order event');
