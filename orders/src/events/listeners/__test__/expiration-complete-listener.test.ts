import {
  ExpirationCompleteEvent,
  OrderStatus,
} from "@mestihudson-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { ExpirationCompleteListener } from "@/events/listeners/expiration-complete-listener";
import { natsWrapper } from "@/nats-wrapper";
import { Order } from "@/models/order";
import { Ticket } from "@/models/ticket";

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

it("should update order status to cancelled", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "user-id",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {};

  await listener.onMessage(data, message);

  const expiredOrder = await Order.findById(order.id);
  expect(expiredOrder!.status).toBe(OrderStatus.Cancelled);
});

it.todo("should emit an order cancelled event");
it.todo("should acknowledge message");
