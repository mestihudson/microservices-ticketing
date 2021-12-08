import request from "supertest";

import { app } from "@/app";

it("should handle post requests by listening to /api/payments route", async () => {
  const { status } = await request(app).post("/api/payments").send({});
  expect(status).not.toBe(404);
});

it.todo("should permit access only to signed in users");
it.todo("should throw an error if token has not provided");
it.todo("should throw an error if orderId has not provided");
it.todo("should throw an error if order has not found");
it.todo("should throw an error if order has not belong to current user");
it.todo("should throw an error if order has cancelled");
