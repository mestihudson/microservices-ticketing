import { randomBytes } from "crypto";

import { stripe } from "@/stripe";

class ChargesAdapter {
  async create(price: number, source: string) {
    const description = randomBytes(12).toString("hex");
    const amount = Math.floor(price * 100);
    await stripe.charges.create({
      amount,
      source,
      currency: "usd",
      description,
    });
  }
}

export const chargesAdapter = new ChargesAdapter();
