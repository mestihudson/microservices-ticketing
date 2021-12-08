import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  OrderCancelledEvent,
} from "@mestihudson-ticketing/common";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = "payments-service";

  async onMessage(data: OrderCancelledEvent["data"], message: Message) {}
}
