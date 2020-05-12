import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../../../../config/multer';

import FileController from '../../../controllers/FileController';

const upload = multer(multerConfig);
const routes = Router();

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
