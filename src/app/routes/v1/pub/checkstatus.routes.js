import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.send('ok Argos'));

export default routes;
