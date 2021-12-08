import express, { Request, Response } from "express";

import { requireAuth } from "@mestihudson-ticketing/common";

const router = express.Router();

router.post("/api/payments", requireAuth, (req: Request, res: Response) => {
  res.send({});
});

export { router as newPaymentRouter };
