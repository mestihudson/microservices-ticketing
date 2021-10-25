import express from 'express';
import { json } from 'body-parser';

import { currentRouter } from './routes/current';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

const app = express();
app.use(json());

app.use(currentRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.listen(3000, () => {
  console.log('Listening on 3000!')
});
