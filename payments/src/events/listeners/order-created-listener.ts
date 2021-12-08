import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  OrderCreatedEvent,
} from "@mestihudson-ticketing/common";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = "payments-service";

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {}
}
