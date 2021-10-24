import express from 'express';
import { json } from 'body-parser';

import { currentRouter } from './routers/current';
import { signinRouter } from './routers/signin';
const app = express();
app.use(json());

app.use(currentRouter);
app.use(signinRouter);

app.listen(3000, () => {
  console.log('Listening on 3000!')
});
