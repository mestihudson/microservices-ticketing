import request from "supertest";

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

it.todo("should throw an error if orderId has not provided");
it.todo("should throw an error if order has not found");
it.todo("should throw an error if order has not belong to current user");
it.todo("should throw an error if order has cancelled");
