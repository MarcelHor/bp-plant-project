import {Router} from 'express';
import {getPlantSettings, setPlantSettings, toggleWatering} from "../controllers/plantSettingsController";

const plantSettingsRouter = Router();

plantSettingsRouter.get('/', getPlantSettings);
plantSettingsRouter.post('/', setPlantSettings);
plantSettingsRouter.post('/toggle', toggleWatering);

export default plantSettingsRouter;
