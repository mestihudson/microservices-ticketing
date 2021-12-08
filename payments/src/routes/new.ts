import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@mestihudson-ticketing/common";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newPaymentRouter };
