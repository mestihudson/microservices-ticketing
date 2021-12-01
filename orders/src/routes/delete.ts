import express, { Request, Response } from "express";

import {
  requireAuth,
  NotFoundError,
  OrderStatus,
  NotAuthorizedError,
} from "@mestihudson-ticketing/common";
import { Order } from "@/models/order";
import { OrderCancelledPublisher } from "@/events/publishers/order-cancelled-publisher";
import { natsWrapper } from "@/nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });
    res.send(order);
  }
);

export { router as deleteOrderRouter };
