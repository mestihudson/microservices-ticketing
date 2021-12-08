import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  OrderCancelledEvent,
} from "@mestihudson-ticketing/common";

import { Order } from "@/models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = "payments-service";

  async onMessage(data: OrderCancelledEvent["data"], message: Message) {
    const order = await Order.findById(data.id);
    if (!order) {
      throw new Error("Order not found");
    }
  }
}
