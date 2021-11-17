import request from 'supertest';

import { app } from '@/app';

it.todo('retuns a 404 if the provided id does not exists');
it.todo('returns a 401 if the user is not authenticated');
it.todo('returns a 401 if the user does not own the ticket');
it.todo('returns a 400 if the user provides an invalid title or price');
it.todo('updates the ticket provided valid inputs');
