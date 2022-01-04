import mongoose from "mongoose";

import { PaymentCreatedEvent, OrderStatus } from "@mestihudson-ticketing/common";
import { PaymentCreatedListener } from "@/events/listeners/payment-created-listener";
import { natsWrapper } from "@/nats-wrapper";
import { Order } from "@/models/order";
import { Ticket } from "@/models/ticket";

const setup = async (orderId = "order-id") => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  //@ts-ignore
  const data: PaymentCreatedEvent["data"] = {
    orderId
  };

  //@ts-ignore
  const message: Message = {};

  return { listener, data, message };
};

const callListener = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id,
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    userId: "user-id",
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
  });
  await order.save();
  const { listener, data, message } = await setup(order.id);
  await listener.onMessage(data, message)
  return { orderId: order.id };
};

it("should throw an error if order has not found", async () => {
  const { listener, data, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (error) {
    return;
  }

  throw new Error("An exception should have been raised");
});

it("should update order status to completed", async () => {
  const { orderId } = await callListener();

  const updated = await Order.findById(orderId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(updated!.status).toBe(OrderStatus.Complete);
});

it.todo("should acknowledge a message");
