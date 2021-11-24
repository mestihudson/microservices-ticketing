import express, { Request, Response } from 'express';

import { requireAuth, NotFoundError } from '@mestihudson-ticketing/common';
import { Order } from '@/models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
  res.send({});
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    throw new NotFoundError();
  }
});

export { router as showOrderRouter };
