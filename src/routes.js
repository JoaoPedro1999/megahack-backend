import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserSessionController from './app/controllers/UserSessionController';
import ProfessionalSessionController from './app/controllers/ProfessionalSessionController';
import UserController from './app/controllers/UserController';
import ConnectedController from './app/controllers/ConnectedController';
import ProfessionalController from './app/controllers/ProfessionalController';
import ConsultationController from './app/controllers/ConsultationController';
import AvailableController from './app/controllers/AvailableController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Gohealth' });
});

/* Create a professional user */
routes.post('/professionals', ProfessionalController.store);

/* Create a patience user */
routes.post('/users', UserController.store);

/* Create a session user */
routes.post('/sessions/professional', ProfessionalSessionController.store);
routes.post('/sessions/user', UserSessionController.store);

routes.use(authMiddleware);

/* Create a connected user */
routes.post('/connected', ConnectedController.store);

/* Update user information */
routes.put('/users', UserController.update);

/* List of professional and available for each professsional */
routes.get('/professionals', ProfessionalController.index);
routes.get(
  '/professionals/:professionalId/available',
  AvailableController.index
);

/* List schedule of professional */
routes.get('/schedule', ScheduleController.index);

/* List, Create, Delete consultations */
routes.get('/consultations', ConsultationController.index);
routes.post('/consultations', ConsultationController.store);
routes.delete('/consultations/:id', ConsultationController.delete);

/* List and Update notifications */
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
