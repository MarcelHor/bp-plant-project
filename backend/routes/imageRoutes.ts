import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { uploadImage } from '../controllers/imageController';

const imageRoutes = Router();

imageRoutes.post('/', upload.single('image'), uploadImage);

export { imageRoutes };
