it.todo('should update ticket with orderId that own request')
it.todo('should acknowledge message')
import { Message } from 'node-nats-streaming';

import {
  OrderCreatedListener
} from '@/events/listeners/order-created-listener';
import { natsWrapper } from '@/nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@mestihudson-ticketing/common';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: 'order-id',
    version: 0,
    status: OrderStatus.Created,
    userId: 'user-id',
    expiresAt: 'expiresAt',
    ticket: { id: 'ticket-id', price: 1 }
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

