import express, { Request, Response } from "express";

import { requireAuth } from "@mestihudson-ticketing/common";
import { Order } from "@/models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userId: req.currentUser!.id,
  }).populate("ticket");
  res.send(orders);
});

export { router as indexOrderRouter };
