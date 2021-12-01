import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import {
  OrderCreatedListener
} from '@/events/listeners/order-created-listener';
import { natsWrapper } from '@/nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@mestihudson-ticketing/common';
import { Ticket } from '@/models/ticket';

const setup = async (orderId: string = 'order-id', ticket?: any) => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const { id, price } = ticket || { id: 'ticket-id', price: 1 };

  const data: OrderCreatedEvent['data'] = {
    id: orderId,
    version: 0,
    status: OrderStatus.Created,
    userId: 'user-id',
    expiresAt: 'expiresAt',
    ticket: { id, price }
  };
  //@ts-ignore
  const message: Message = {
    ack: jest.fn()
  };
  return { listener, data, message };
};

const callListener = async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'user-id'
  });
  await ticket.save();

  const { listener, data, message } = await setup(orderId, ticket);

  await listener.onMessage(data, message);

  return  { message, ticket, orderId };
};

it('should throw an error if ticket has not found', async () => {
  const { listener, data, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (error) {
    return;
  }

  throw new Error('An exception should have been raised');
});

it('should update ticket with orderId that own request', async () => {
  const { message, ticket, orderId } = await callListener();

  const updated = await Ticket.findById(ticket.id);
  expect(updated!.orderId).toBe(orderId);
});

it('should acknowledge message', async () => {
  const { message } = await callListener();

  expect(message.ack).toHaveBeenCalled();
});

it('should notify about ticket update', async () => {
  await callListener();

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
		1,
		'ticket:updated',
    expect.stringMatching(/orderId/),
		expect.any(Function)
  );
});