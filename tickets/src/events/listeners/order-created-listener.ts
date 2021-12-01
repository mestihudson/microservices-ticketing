import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  OrderCreatedEvent,
} from "@mestihudson-ticketing/common";
import { Ticket } from "@/models/ticket";
import { queueGroupName } from "@/events/listeners/queue-group-name";
import { TicketUpdatedPublisher } from "@/events/publishers/ticket-updated-publisher";
import { natsWrapper } from "@/nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    message.ack();
  }
}
