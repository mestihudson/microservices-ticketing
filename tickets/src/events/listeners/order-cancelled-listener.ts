import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  OrderCancelledEvent,
} from "@mestihudson-ticketing/common";
import { queueGroupName } from "@/events/listeners/queue-group-name";
import { Ticket } from "@/models/ticket";
import { TicketUpdatedPublisher } from "@/events/publishers/ticket-updated-publisher";
import { natsWrapper } from "@/nats-wrapper";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], message: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ orderId: undefined });
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
