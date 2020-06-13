import { Router } from 'express';

const routes = Router();

routes.get('/testAuth', (req, res) => res.send({ message: 'ok Auth argos' }));

export default routes;
