import request from 'supertest';

import { app } from '@/app';
import { Order } from '@/models/order';
import { Ticket } from '@/models/ticket';

it('should have a route handler listening to /api/orders for get requests', async () => {
  const { status } = await request(app)
    .get('/api/orders')
    .send({});
  expect(status).not.toBe(404);
});

it('should can only be accessed if the user is signed in', async () => {
  await request(app)
    .get('/api/orders')
    .send({})
    .expect(401);
});

it('should return a status other than 401 if the user is signed in', async () => {
  const { status } = await request(app)
    .get('/api/orders')
    .set('Cookie', signin())
    .send({});
  expect(status).not.toBe(401);
});

const buildTicket = async () => {
	const ticket = Ticket.build({ title: 'concert', price: 20	});
	await ticket.save();
	return ticket
};

const buildOrder = async (user: any, ticket: any) => {
	await request(app)
	  .post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);
};

it('should fetch orders for an particular user', async () => {
	const ticketOne = await buildTicket();
	const ticketTwo = await buildTicket();
	const ticketThree = await buildTicket();

	const userOne = signin('1@1.com', '1');
	const userTwo = signin('2@2.com', '2');

	await buildOrder(userOne, ticketOne);
	await buildOrder(userTwo, ticketTwo);
	await buildOrder(userTwo, ticketThree);

	const responseOne = await request(app)
	  .get('/api/orders')
		.set('Cookie', userOne)
		.send({})
		.expect(200);
	expect(responseOne.body.length).toBe(1);
	const responseTwo = await request(app)
	  .get('/api/orders')
		.set('Cookie', userTwo)
		.send({})
		.expect(200);
	expect(responseTwo.body.length).toBe(2);
});
it.todo('should fetched orders have be populated with the ticket');
