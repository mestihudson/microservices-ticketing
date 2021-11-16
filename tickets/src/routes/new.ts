import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@mestihudson-ticketing/common';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required')
  ],
  validateRequest, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as newTicketRouter };
