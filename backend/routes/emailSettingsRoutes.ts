import {setEmailSettings,getEmailSettings} from "../controllers/emailSettingsController";
import {Router} from 'express';

const emailSettingsRouter = Router();

emailSettingsRouter.post('/', setEmailSettings);
emailSettingsRouter.get('/', getEmailSettings);


export default emailSettingsRouter;