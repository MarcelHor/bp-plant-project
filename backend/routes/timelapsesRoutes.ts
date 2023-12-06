import {Router} from 'express';
import {createTimelapseEndpoint, streamTimelapseEndpoint, getTimelapses, deleteTimelapse} from "../controllers/timelapsesController";

const timelapsesRouter = Router();

timelapsesRouter.post('/', createTimelapseEndpoint);
timelapsesRouter.get('/:name', streamTimelapseEndpoint);
timelapsesRouter.get('/', getTimelapses);
timelapsesRouter.delete('/:id', deleteTimelapse);


export default timelapsesRouter;