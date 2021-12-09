import { stripe } from "@/stripe";
import { chargesAdapter } from "@/charges-adapter";

jest.setTimeout(60 * 1000);

const getLatestCharge = async (price: number) => {
  const charges = await stripe.charges.list({ limit: 1 });
  const charge = charges.data.find(
    ({ amount, description }) => amount === Math.floor(price * 100)
  );
  return { charge };
};

it("should create a charge on stripe service", async () => {
  const value = Math.random();
  const price = value * 100;
  const token = "tok_visa";

  await chargesAdapter.create(price, token);

  const { charge: after } = await getLatestCharge(price);
  expect(after).toBeDefined();
});
