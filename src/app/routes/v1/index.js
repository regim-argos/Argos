import { Router } from 'express';
import auth from '../../middlewares/auth';
import pubRoutes from './pub';
import pvtRoutes from './pvt';
import getCache from '../../middlewares/getCache';
import setCache from '../../middlewares/setCache';
import invalidateCache from '../../middlewares/invalidateCache';

const routes = new Router();

routes.use('/pub', pubRoutes);
routes.use('/pvt', auth, getCache, pvtRoutes, setCache, invalidateCache);

export default routes;
