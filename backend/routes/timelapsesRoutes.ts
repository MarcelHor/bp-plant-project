import {Router} from 'express';
import {createTimelapseEndpoint} from "../controllers/timelapsesController";

const timelapsesRouter = Router();

timelapsesRouter.post('/', createTimelapseEndpoint);


export default timelapsesRouter;