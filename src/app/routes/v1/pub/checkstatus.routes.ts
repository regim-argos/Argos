import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.send('ok Argos'));

export default routes;
