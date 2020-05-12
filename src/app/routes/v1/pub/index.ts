import { Router } from 'express';

import confirmEmail from './confirmEmail.routes';
import forgetPassword from './forgetPassword.routes';
import checkstatus from './checkstatus.routes';
import bullBoard from './bullBoard.routes';
import session from './session.routes';
import user from './user.routes';

const routes = Router();

routes.use(user);
routes.use(confirmEmail);
routes.use(forgetPassword);
routes.use(checkstatus);
routes.use(bullBoard);
routes.use(session);

export default routes;
