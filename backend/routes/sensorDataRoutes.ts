import {getLatest, getById, getThumbnails, getChartData} from "../controllers/sensorDataController";
import {Router} from 'express';

const sensorDataRouter = Router();

sensorDataRouter.get('/latest', getLatest);
sensorDataRouter.get('/data/:id', getById);
sensorDataRouter.get('/thumbnails', getThumbnails);
sensorDataRouter.get('/chart', getChartData);


export default sensorDataRouter;