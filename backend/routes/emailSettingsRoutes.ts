import {setEmailSettings} from "../controllers/emailSettingsController";

const emailSettingsRouter = require('express').Router();

emailSettingsRouter.post('/', setEmailSettings);

export default emailSettingsRouter;