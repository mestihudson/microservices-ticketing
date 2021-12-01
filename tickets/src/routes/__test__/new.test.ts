import request from "supertest";

import { app } from "@/app";
import { natsWrapper } from "@/nats-wrapper";
import { Ticket } from "@/models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

describe("returns an error if an invalid title is provided", () => {
  it.each([{ title: "" }, {}])("provided title: %s", async (providedTitle) => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ ...providedTitle, price: 10 })
      .expect(400);
  });
});

describe("returns an error if an invalid price is provided", () => {
  it.each([{ price: -10 }, { price: 0 }, {}])(
    "provided price: %s",
    async (providedPrice) => {
      await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({ title: "dsfjapsodf", ...providedPrice })
        .expect(400);
    }
  );
});

it("create a ticket with valid inputs", async () => {
  const before = await Ticket.find({});
  expect(before.length).toEqual(0);

  const provided = { title: "sçdfalkjsçd", price: 20 };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send(provided)
    .expect(201);

  const after = await Ticket.find({});
  expect(after.length).toEqual(1);
  expect(after[0].title).toEqual(provided.title);
  expect(after[0].price).toEqual(provided.price);
});

it("publish an event", async () => {
  const provided = { title: "sçdfalkjsçd", price: 20 };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send(provided)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
    1,
    "ticket:created",
    expect.any(String),
    expect.any(Function)
  );
});
