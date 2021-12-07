import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { ExpirationCompleteEvent } from "@mestihudson-ticketing/common";
import { ExpirationCompleteListener } from "@/events/listeners/expiration-complete-listener";
import { natsWrapper } from "@/nats-wrapper";
import { Order } from "@/models/order";

it("should raise an error if order has not found", async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // @ts-ignore
  const data: ExpirationCompleteEvent["data"] = {};

  // @ts-ignore
  const message: Message = {};

  try {
    await listener.onMessage(data, message);
  } catch (err) {
    return;
  }

  throw new Error("An exception should have been raised");
});

it.todo("should update order status to cancelled");
it.todo("should emit an order cancelled event");
it.todo("should acknowledge message");
