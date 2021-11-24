import express, { Request, Response } from 'express';

import {
  requireAuth, NotFoundError, OrderStatus
} from '@mestihudson-ticketing/common';
import { Order } from '@/models/order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();
  res.send(order);
});

export { router as deleteOrderRouter };
