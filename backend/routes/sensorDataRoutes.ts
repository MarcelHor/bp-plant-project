import {getLatest, getById, getThumbnails} from "../controllers/sensorDataController";
import {Router} from 'express';

const sensorDataRouter = Router();

sensorDataRouter.get('/latest', getLatest);
sensorDataRouter.get('/data/:id', getById);
sensorDataRouter.get('/thumbnails', getThumbnails);

export default sensorDataRouter;