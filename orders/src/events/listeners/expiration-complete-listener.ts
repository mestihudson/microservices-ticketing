import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
} from "@mestihudson-ticketing/common";
import { queueGroupName } from "@/events/listeners/queue-group-name";
import { Order } from "@/models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order has not found");
    }
  }
}
