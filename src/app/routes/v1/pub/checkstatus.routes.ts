import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.send({ message: 'ok Argos' }));

export default routes;
