it("should throw an error if order has not found", async () => {
  const { listener, data, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (error) {
    return;
  }

  throw new Error("An exception should have been raised");
});

it.todo("should update order status to completed");
it.todo("should emit a order completed event");
it.todo("should acknowledge a message");
