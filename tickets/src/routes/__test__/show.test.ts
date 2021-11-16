import request from 'supertest';

import { app } from '@/app';

it.todo('returns the ticket if it has been found')
it('returns a 404 if the ticket is not found', async () => {
	const id = 'ticket-id';
	const response = await request(app)
	  .get(`/api/tickets/${id}`)
		.send()
		.expect(404);
});

