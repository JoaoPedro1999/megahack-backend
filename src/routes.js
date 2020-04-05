import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Gohealth' });
});
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
