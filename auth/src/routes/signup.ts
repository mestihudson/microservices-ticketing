import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).send('Provide a valid email');
  }
  if (!password || typeof password !== 'string') {
    res.status(400).send('Provide a valid password');
  }
});

export { router as signupRouter };
