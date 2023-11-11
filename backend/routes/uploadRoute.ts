import {Router} from "express";
import {processImageAndSensorData} from "../controllers/uploadController";
import { upload } from '../middleware/uploadMiddleware';

const uploadRoute = Router();

uploadRoute.post('/', upload.single('image'), processImageAndSensorData);

export default uploadRoute;