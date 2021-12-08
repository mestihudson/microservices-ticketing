import request from "supertest";
import mongoose from "mongoose";

import { OrderStatus } from "@mestihudson-ticketing/common";

import { Order } from "@/models/order";
import { app } from "@/app";

it("should handle post requests by listening to /api/payments route", async () => {
  const { status } = await request(app).post("/api/payments").send({});
  expect(status).not.toBe(404);
});

it("should not permit access to unsigned in users", async () => {
  await request(app).post("/api/payments").send({}).expect(401);
});

it("should permit access to signed in users", async () => {
  const { status } = await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({});
  expect(status).not.toBe(401);
});

it("should throw an error if token has not provided", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({})
    .expect(400);
});

it("should throw an error if orderId has not provided", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ token: "token" })
    .expect(400);
});

it("should throw an error if order has not found", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ token: "token", orderId })
    .expect(404);
});

const createOrder = async (status?: OrderStatus, userId?: string) => {
  status = status || OrderStatus.Created;
  userId = userId || "userId";

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status,
    userId,
    version: 0,
  });
  await order.save();

  return { orderId: order.id };
};

it("should throw an error if order has not belong to current user", async () => {
  const { orderId } = await createOrder();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ token: "token", orderId })
    .expect(401);
});

it("should throw an error if order has cancelled", async () => {
  const userId = "userId";
  const cookie = signin("t@t.com", userId);
  const { orderId } = await createOrder(OrderStatus.Cancelled, userId);

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ token: "token", orderId })
    .expect(400);
});
