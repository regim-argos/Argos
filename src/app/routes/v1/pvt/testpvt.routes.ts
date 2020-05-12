import { Router } from 'express';

const routes = Router();

routes.get('/testAuth', (req, res) => res.send('Test Auth'));

export default routes;
