import { Router } from 'express';

import WatcherController from '../../../controllers/WatcherController';

const routes = new Router();

routes.get('/', (req, res, next) => WatcherController.index(req, res, next));
routes.get('/:id', (req, res, next) => WatcherController.show(req, res, next));
routes.post('/', (req, res, next) => WatcherController.store(req, res, next));
routes.put('/:id', (req, res, next) =>
  WatcherController.update(req, res, next)
);
routes.delete('/:id', (req, res, next) =>
  WatcherController.delete(req, res, next)
);

export default new Router().use('/watchers', routes);
