import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  OrderCreatedEvent,
} from "@mestihudson-ticketing/common";
import { queueGroupName } from "@/events/listeners/queue-group-name";
import { expirationQueue } from "@/queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay }
    );
    message.ack();
  }
}
