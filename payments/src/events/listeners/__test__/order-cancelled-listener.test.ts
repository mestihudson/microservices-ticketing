import mongoose from "mongoose";

import {
  OrderStatus,
  OrderCancelledEvent,
} from "@mestihudson-ticketing/common";

import { Order } from "@/models/order";
import { OrderCancelledListener } from "@/events/listeners/order-cancelled-listener";
import { natsWrapper } from "@/nats-wrapper";

const createOrder = async (id?: string) => {
  id = id || new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id,
    price: 20,
    status: OrderStatus.Created,
    userId: "userid",
    version: 0,
  });
  await order.save();
};

const setup = async (id?: string, version?: number) => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  id = id || new mongoose.Types.ObjectId().toHexString();
  version = version || 0;

  const data: OrderCancelledEvent["data"] = {
    id,
    version,
    ticket: {
      id: "ticketId",
    },
  };

  // @ts-ignore
  const message: Message = {};

  return { listener, data, message };
};

it("should throw an error if order has not found", async () => {
  await createOrder();

  const { listener, data, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (err) {
    return;
  }

  throw new Error("should have been raised an error");
});

it("should throw an error if order version is not immediately ancestry", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await createOrder(id);

  const { listener, data, message } = await setup(id, 2);

  try {
    await listener.onMessage(data, message);
  } catch (err) {
    return;
  }

  throw new Error("should have been raised an error");
});

it.todo("should change order status to cancelled");
it.todo("should acknowlegde message");
