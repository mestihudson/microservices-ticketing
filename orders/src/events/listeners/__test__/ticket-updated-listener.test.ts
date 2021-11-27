import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { TicketUpdatedEvent } from '@mestihudson-ticketing/common';
import {
  TicketUpdatedListener
} from '@/events/listeners/ticket-updated-listener';
import { natsWrapper } from '@/nats-wrapper';
import { Ticket } from '@/models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert new',
    price: 30,
    userId: 'dfaksdfk'
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, ticket };
};

it('should find, update and save the ticket', async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  const updated = await Ticket.findById(ticket.id);
  expect(updated).toMatchObject(expect.objectContaining({
    title: data.title,
    price: data.price,
    version: data.version
  }));
});

it('should ack the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it.todo('should not call ack if the event has skipped version number');
