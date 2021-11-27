import { Message } from 'node-nats-streaming';

import {
  Subjects, Listener, TicketUpdatedEvent
} from '@mestihudson-ticketing/common';
import { Ticket } from '@/models/ticket';
import { queueGroupName } from '@/events/listeners/queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findOne({
      _id: id,
      version: version - 1
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    message.ack();
  }
}
