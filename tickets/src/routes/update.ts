import express, { Request, Response } from 'express';

import { Ticket } from '@/models/ticket';
import { NotFoundError, requireAuth } from '@mestihudson-ticketing/common';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }
});

export { router as updateTicketRouter };
