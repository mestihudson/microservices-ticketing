import express from 'express';

import { currentUser } from '@mestihudson-ticketing/common';

const router = express.Router();

router.get('/api/users/current', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentRouter };
