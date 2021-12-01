it.todo('should acknowledge message')
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
  };
  return { listener, data, message };
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
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'user-id'
  });
  await ticket.save();

  const { listener, data, message } = await setup(orderId, ticket);

  await listener.onMessage(data, message);

  const updated = await Ticket.findById(ticket.id);
  expect(updated!.orderId).toBe(orderId);
});

