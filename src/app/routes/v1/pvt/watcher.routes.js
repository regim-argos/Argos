import { Router } from 'express';

import WatcherController from '../../../controllers/WatcherController';

const routes = new Router();

routes.get('/', WatcherController.index);
routes.get('/:id', WatcherController.show);
routes.post('/', WatcherController.store);
routes.put('/:id', WatcherController.update);
routes.delete('/:id', WatcherController.delete);

export default new Router().use('/watchers', routes);
