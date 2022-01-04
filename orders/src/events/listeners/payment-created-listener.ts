import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@mestihudson-ticketing/common";
import { queueGroupName } from "@/events/listeners/queue-group-name";
import { Order } from "@/models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Complete
    });
    await order.save();
  }
}
