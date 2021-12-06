import mongoose from "mongoose";

import { OrderCancelledEvent } from "@mestihudson-ticketing/common";
import { OrderCancelledListener } from "@/events/listeners/order-cancelled-listener";
import { natsWrapper } from "@/nats-wrapper";
import { Ticket } from "@/models/ticket";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  return { listener };
};

it("should throw an error if ticket has not found", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
  };

  const { listener } = await setup();

  try {
    await listener.onMessage(data);
  } catch (error) {
    return;
  }

  throw new Error("An exception should have been raised");
});

it("should update orderId field of ticket with undefined value", async () => {
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

  const { listener } = await setup();

  await listener.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it.todo("should acknowledge message");
it.todo("should notify about ticket update");
