import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@mestihudson-ticketing/common";
import { Ticket } from "@/models/ticket";
import { queueGroupName } from "@/events/listeners/queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], message: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    message.ack();
  }
}
