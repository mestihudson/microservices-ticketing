import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/app';

it('retuns a 404 if the provided id does not exists', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
	  .put(`/api/tickets/${id}`)
		.set('Cookie', signin())
		.send({ title: 'dklfjaçslkd', price: 20 })
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
	  .put(`/api/tickets/${id}`)
		.send({ title: 'dklfjaçslkd', price: 20 })
		.expect(401);
});

it.todo('returns a 401 if the user does not own the ticket');
it.todo('returns a 400 if the user provides an invalid title or price');
it.todo('updates the ticket provided valid inputs');
