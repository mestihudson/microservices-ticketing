import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  OrderStatus,
} from "@mestihudson-ticketing/common";

import { Order } from "@/models/order";
import { Payment } from "@/models/payment";
import { chargesAdapter } from "@/charges-adapter";
import { PaymentCreatedPublisher } from "@/events/publishers/payment-created-publisher";
import { natsWrapper } from "@/nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }
    const { stripeId } = await chargesAdapter.create(order.price, token);
    const payment = Payment.build({ orderId, stripeId });
    await payment.save();
    res.status(201).send({ success: true });
  }
);

export { router as newPaymentRouter };
