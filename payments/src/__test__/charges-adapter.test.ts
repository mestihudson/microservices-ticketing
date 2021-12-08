it("should create a charge on stripe service", async () => {
  const value = Math.random();
  const price = value * 100;
  const token = "tok_visa";

  await chargesAdapter.create(price, token);

  const { charge: after } = await getLatestCharge(price);
  expect(after).toBeDefined();
});
