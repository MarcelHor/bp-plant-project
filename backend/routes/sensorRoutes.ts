import {getSensorsValues, createSensorsValues} from "../controllers/sensorController";
import { Router } from "express";

const sensorRoutes = Router();

sensorRoutes.get('/:id', getSensorsValues);
sensorRoutes.post('/', createSensorsValues);

export {sensorRoutes};