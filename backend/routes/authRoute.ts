import {Router} from 'express';
import {ensureAuthenticated} from "../middleware/authMiddleware";
import {login, logout, user, changeCreds} from "../controllers/authController";

const authRouter = Router();

authRouter.post('/login', login);

authRouter.post('/logout', logout);

authRouter.get('/user', ensureAuthenticated, user);

authRouter.post('/change', ensureAuthenticated, changeCreds);


export default authRouter;