import { randomBytes } from "crypto";

import { stripe } from "@/stripe";

class ChargesAdapter {
  async create(price: number, token: string) {}
}

export const chargesAdapter = new ChargesAdapter();
