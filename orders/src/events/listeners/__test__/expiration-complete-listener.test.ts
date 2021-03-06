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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data: ExpirationCompleteEvent["data"] = {};

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  const { order } = await callListener();

  const expiredOrder = await Order.findById(order.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(expiredOrder!.status).toBe(OrderStatus.Cancelled);
});

it("should emit an order cancelled event", async () => {
  const { order, ticket } = await callListener();

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    1,
    "order:cancelled",
    expect.stringMatching(/ticket/),
    expect.any(Function)
  );
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toBe(order.id);
  expect(eventData.ticket.id).toBe(ticket.id);
});

it("should acknowledge message", async () => {
  const { message } = await callListener();

  expect(message.ack).toHaveBeenCalled();
});

it("should not cancel a completed order", async () => {
  const { order, message } = await callListener(OrderStatus.Complete);

  const expiredOrder = await Order.findById(order.id);
  expect(expiredOrder!.status).not.toBe(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(0);
  expect(message.ack).toHaveBeenCalled();
});

const callListener = async (status = OrderStatus.Created) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status,
    userId: "user-id",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, message);

  return { message, order, ticket };
};
