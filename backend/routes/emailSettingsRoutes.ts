import {setEmailSettings,getEmailSettings} from "../controllers/emailSettingsController";

const emailSettingsRouter = require('express').Router();

emailSettingsRouter.post('/', setEmailSettings);
emailSettingsRouter.get('/', getEmailSettings);


export default emailSettingsRouter;