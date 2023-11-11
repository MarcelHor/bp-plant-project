import {getLatest} from "../controllers/sensorDataController";
import {Router} from 'express';

const sensorDataRouter = Router();

sensorDataRouter.get('/latest', getLatest);

export default sensorDataRouter;