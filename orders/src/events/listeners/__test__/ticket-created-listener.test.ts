import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { TicketCreatedEvent } from "@mestihudson-ticketing/common";
import { TicketCreatedListener } from "@/events/listeners/ticket-created-listener";
import { natsWrapper } from "@/nats-wrapper";
import { Ticket } from "@/models/ticket";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("should create and save a ticket", async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toMatchObject(
    expect.objectContaining({
      title: data.title,
      price: data.price,
    })
  );
});

it("should ack the message", async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
