import {createApiKey, deleteApiKey, getApiKey, getApiKeys} from "../controllers/apiKeyController";
import {Router} from "express";

const apiKeyRouter = Router();

apiKeyRouter.get('/', getApiKeys);
apiKeyRouter.post('/', createApiKey);
apiKeyRouter.delete('/:id', deleteApiKey);
apiKeyRouter.get('/key/:id', getApiKey);

export default apiKeyRouter;
