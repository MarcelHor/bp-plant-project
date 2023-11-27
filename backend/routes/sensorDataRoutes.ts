import {
    getLatest,
    getById,
    getThumbnails,
    getChartData,
    getClosestThumbnails
} from "../controllers/sensorDataController";
import {Router} from 'express';

const sensorDataRouter = Router();

sensorDataRouter.get('/latest', getLatest);
sensorDataRouter.get('/data/:id', getById);
sensorDataRouter.get('/thumbnails', getThumbnails);
sensorDataRouter.get('/chart', getChartData);
sensorDataRouter.get('/closest', getClosestThumbnails);


export default sensorDataRouter;