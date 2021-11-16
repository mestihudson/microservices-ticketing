import request from 'supertest';

import { app } from '@/app';

it('returns a 404 if the ticket is not found', async () => {
	const id = 'ticket-id';
	const response = await request(app)
	  .get(`/api/tickets/${id}`)
		.send()
		.expect(404);
});

it('returns the ticket if it has been found', async () => {
	const ticket = { title: 'concert', price: 20 };

	const response = await request(app)
	  .post('/api/tickets')
		.set('Cookie', signin())
		.send(ticket)
		.expect(201);

	const ticketResponse = await request(app)
	  .get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body).toMatchObject(ticket);
});
