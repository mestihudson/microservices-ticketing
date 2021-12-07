import { Message } from "node-nats-streaming";

import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@mestihudson-ticketing/common";
import { queueGroupName } from "@/events/listeners/queue-group-name";
import { Order } from "@/models/order";
import { OrderCancelledPublisher } from "@/events/publishers/order-cancelled-publisher";
import { natsWrapper } from "@/nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order has not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });
  }
}
