import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCancelledEvent } from "@mestihudson-ticketing/common";
import { OrderCancelledListener } from "@/events/listeners/order-cancelled-listener";
import { natsWrapper } from "@/nats-wrapper";
import { Ticket } from "@/models/ticket";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, message };
};

it("should throw an error if ticket has not found", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
  };

  const { listener, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (error) {
    return;
  }

  throw new Error("An exception should have been raised");
});

const createValidOrderCancelledEventData = async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "user-id",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: { id: ticket.id },
  };

  const { listener, message } = await setup();

  await listener.onMessage(data, message);

  return { ticket, message };
};

it("should update orderId field of ticket with undefined value", async () => {
  const { ticket } = await createValidOrderCancelledEventData();

  const updatedTicket = await Ticket.findById(ticket.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("should acknowledge message", async () => {
  const { message } = await createValidOrderCancelledEventData();

  expect(message.ack).toHaveBeenCalled();
});

it("should notify about ticket update", async () => {
  await createValidOrderCancelledEventData();

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    1,
    "ticket:updated",
    expect.not.stringMatching(/orderId/),
    expect.any(Function)
  );
});
