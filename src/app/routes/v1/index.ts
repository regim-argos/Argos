import { Router } from 'express';
import auth from '../../middlewares/auth';
import pubRoutes from './pub';
import pvtRoutes from './pvt';

const routes = Router();

routes.use('/pub', pubRoutes);
routes.use('/pvt', auth, pvtRoutes);

export default routes;
