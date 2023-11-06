import {getSensorsValues, createSensorsValues} from "../controllers/sensorController";
import { Router } from "express";

const router = Router();

router.get('/:id', getSensorsValues);
router.post('/', createSensorsValues);

export const sensorRoutes = router;