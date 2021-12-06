import request from "supertest";
import mongoose from "mongoose";

import { app } from "@/app";
import { natsWrapper } from "@/nats-wrapper";

it("retuns a 404 if the provided id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "dklfjaçslkd", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "dklfjaçslkd", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin("test@test.com", "new-user-id"))
    .send({ title: "dklfjaçslkd", price: 20 });
  expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin("test@test.com", "update-user-id"))
    .send({ title: "dklfjaçslkd", price: 200 })
    .expect(401);
});

describe("returns a 400 if the user provides an invalid input", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cookie: any, response: any;

  beforeAll(async () => {
    cookie = signin("test@test.com", "new-user-id");

    response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "dklfjaçslkd", price: 20 });
    expect(201);
  });

  it.each([
    { title: "", price: 200 },
    { price: 200 },
    { title: "ajskdçflk", price: -10 },
    { title: "ajskdçflk", price: 0 },
    { title: "ajskdçflk" },
  ])("provided input: %s", async (input) => {
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send(input)
      .expect(400);
  });
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = signin("test@test.com", "new-user-id");

  const creation = { title: "dklfjaçslkd", price: 20 };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(creation)
    .expect(201);

  const update = { title: "kdfjçasldkjfçalsk", price: 200 };
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(update)
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send();

  expect(ticketResponse.body).toMatchObject({ ...update });
});

it("publish an event", async () => {
  const cookie = signin("test@test.com", "new-user-id");

  const creation = { title: "dklfjaçslkd", price: 20 };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(creation);
  expect(201);

  const update = { title: "kdfjçasldkjfçalsk", price: 200 };
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(update)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    2,
    "ticket:updated",
    expect.any(String),
    expect.any(Function)
  );
});
