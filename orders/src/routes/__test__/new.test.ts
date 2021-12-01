import request from "supertest";
import mongoose from "mongoose";

import { OrderStatus } from "@mestihudson-ticketing/common";

import { app } from "@/app";
import { Order } from "@/models/order";
import { Ticket } from "@/models/ticket";

import { natsWrapper } from "@/nats-wrapper";

it("should have a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toBe(404);
});

it("should can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("should return a status other than 401 if the user is signed in", async () => {
  const { status } = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({});
  expect(status).not.toBe(401);
});

it("should return an error if an titleId is not provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({})
    .expect(400);
});

it("should return an error if the ticketId is not a valid id", async () => {
  const ticketId = "ticketId";
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(400);
});

it("should return an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("should return an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "kfjsçalkjçaslkd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("should reserve the ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("should emit an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    1,
    "order:created",
    expect.any(String),
    expect.any(Function)
  );
});
