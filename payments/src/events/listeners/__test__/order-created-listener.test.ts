import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCreatedEvent, OrderStatus } from "@mestihudson-ticketing/common";

import { natsWrapper } from "@/nats-wrapper";
import { OrderCreatedListener } from "@/events/listeners/order-created-listener";
import { Order } from "@/models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const data: OrderCreatedEvent["data"] = {
    id: orderId,
    version: 0,
    expiresAt: "expiresAt",
    userId: "userId",
    status: OrderStatus.Created,
    ticket: {
      id: "ticketId",
      price: 10,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message, orderId };
};

it("should create an order", async () => {
  const { listener, data, message, orderId } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findById(orderId);
  expect(order).not.toBeNull();
});

it("should acknowlegde message", async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
