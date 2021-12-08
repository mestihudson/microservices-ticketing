it("should throw an error if order has not found", async () => {
  await createOrder();

  const { listener, data, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (err) {
    return;
  }

  throw new Error("should have been raised an error");
});

it.todo("should throw an error if order version is not immediately ancestry");
it.todo("should change order status to cancelled");
it.todo("should acknowlegde message");
