import { randomBytes } from "crypto";

import { stripe } from "@/stripe";

class ChargesAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(price: number, source: string): Promise<any> {
    const description = randomBytes(12).toString("hex");
    const amount = Math.floor(price * 100);
    const { id: stripeId } = await stripe.charges.create({
      amount,
      source,
      currency: "usd",
      description,
    });
    return new Promise((resolve) => resolve({ stripeId }));
  }
}

export const chargesAdapter = new ChargesAdapter();
