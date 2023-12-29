import {
    getLatest,
    getById,
    getThumbnails,
    getChartData,
    getClosestThumbnails,
    getLatestDate
} from "../controllers/sensorDataController";
import {Router} from 'express';

const sensorDataRouter = Router();

sensorDataRouter.get('/latest', getLatest);
sensorDataRouter.get('/latestDate', getLatestDate);
sensorDataRouter.get('/data/:id', getById);
sensorDataRouter.get('/thumbnails', getThumbnails);
sensorDataRouter.get('/chart', getChartData);
sensorDataRouter.get('/closest', getClosestThumbnails);


export default sensorDataRouter;