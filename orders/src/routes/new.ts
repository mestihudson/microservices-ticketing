import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import {
  requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError
} from '@mestihudson-ticketing/common';
import { Order } from '@/models/order';
import { Ticket } from '@/models/ticket';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided and valid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  if (await ticket.isReserved()) {
    throw new BadRequestError('Ticket is already reserved');
  }

  res.send({});
});

export { router as newOrderRouter };
