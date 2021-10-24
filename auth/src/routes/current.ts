import express from 'express';

const router = express.Router();

router.get('/api/users/current', (req, res) => {
  res.send('Hi, there!');
});

export { router as currentRouter };
