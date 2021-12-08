import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus,
} from "@mestihudson-ticketing/common";

import { Order } from "@/models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = "payments-service";

  async onMessage(data: OrderCancelledEvent["data"], message: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
  }
}
