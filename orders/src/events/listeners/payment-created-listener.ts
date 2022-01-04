import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
} from "@mestihudson-ticketing/common";
import { queueGroupName } from "@/events/listeners/queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], message: Message) {
  }
}
