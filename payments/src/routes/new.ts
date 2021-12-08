import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/payments", (req: Request, res: Response) => {
  res.send({});
});

export { router as newPaymentRouter };
