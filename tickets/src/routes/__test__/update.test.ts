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

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app)
	  .post('/api/tickets')
		.set('Cookie', signin('test@test.com', 'new-user-id'))
		.send({ title: 'dklfjaçslkd', price: 20 })
		expect(201);

	await request(app)
	  .put(`/api/tickets/${response.body.id}`)
		.set('Cookie', signin('test@test.com', 'update-user-id'))
		.send({ title: 'dklfjaçslkd', price: 200 })
		.expect(401);
});

describe('returns a 400 if the user provides an invalid input', () => {
	let cookie: any, response: any;

	beforeAll(async () => {
		cookie = signin('test@test.com', 'new-user-id');

		response = await request(app)
			.post('/api/tickets')
			.set('Cookie', cookie)
			.send({ title: 'dklfjaçslkd', price: 20 })
			expect(201);
	});

	it.each([
			{ title: '', price: 200 },
			{ price: 200 },
			{ title: 'ajskdçflk', price: -10 },
			{ title: 'ajskdçflk', price: 0 },
			{ title: 'ajskdçflk' }
		])('provided input: %s', async (input) => {

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', cookie)
			.send(input)
			.expect(400);
	});
});

it.todo('updates the ticket provided valid inputs');
