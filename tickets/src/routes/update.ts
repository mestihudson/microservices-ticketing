import express, { Request, Response } from 'express';

import { Ticket } from '@/models/ticket';
import {
  NotFoundError, requireAuth, NotAuthorizedError
} from '@mestihudson-ticketing/common';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.sendStatus(200);
});

export { router as updateTicketRouter };
