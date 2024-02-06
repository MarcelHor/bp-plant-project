import {Router} from 'express';
import {getPlantSettings, setPlantSettings, setWatering} from "../controllers/plantSettingsController";

const plantSettingsRouter = Router();

plantSettingsRouter.get('/', getPlantSettings);
plantSettingsRouter.post('/', setPlantSettings);
plantSettingsRouter.post('/watering', setWatering);

export default plantSettingsRouter;
