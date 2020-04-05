import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import ProfessionalController from './app/controllers/ProfessionalController';
import ConsultationController from './app/controllers/ConsultationController';
import AvailableController from './app/controllers/AvailableController';

import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Gohealth' });
});
routes.post('/professionals', ProfessionalController.store);
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// routes.get('/professionals', ProfessionalController.index);
routes.get(
  '/professionals/:professionalId/available',
  AvailableController.index
);

routes.get('/consultations', ConsultationController.index);
routes.post('/consultations', ConsultationController.store);
routes.delete('/consultations/:id', ConsultationController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
