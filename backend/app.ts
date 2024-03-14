import express from 'express';
import uploadRoute from "./routes/uploadRoute";
import sensorDataRouter from "./routes/sensorDataRoutes";
import timelapsesRouter from "./routes/timelapsesRoutes";
import emailSettingsRouter from "./routes/emailSettingsRoutes";
import eventRouter from "./routes/eventRoute";
import plantSettingsRouter from "./routes/plantSettingsRoutes";
import authRouter from "./routes/authRoute";
import apiKeyRouter from "./routes/apiKeyRoutes";
import {ensureAdminUser} from "./utils/auth";
import {ensureAuthenticated, ensureApiKey} from "./middleware/authMiddleware";
import {runCron} from "./utils/cronjobs/notifications";
import {heartbeat} from "./controllers/eventController";
import {checkStaticFolder} from "./utils/utils";
import cors from 'cors';
import session from 'express-session';

const app = express();
const PORT = 3000;
const HOST = '127.0.0.1';

app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

checkStaticFolder();
ensureAdminUser();

app.use(express.json());
app.use('/upload', ensureApiKey, uploadRoute);
app.use('/sensor-data', ensureAuthenticated, sensorDataRouter);
app.use('/images', ensureAuthenticated, express.static('./static/images'));
app.use('/thumbnails', ensureAuthenticated, express.static('./static/thumbnails'));
app.use('/timelapses', ensureAuthenticated, timelapsesRouter);
app.use('/email-settings', ensureAuthenticated, emailSettingsRouter);
app.use('/events', ensureAuthenticated, eventRouter);
app.use('/plant-settings', ensureAuthenticated, plantSettingsRouter);
app.use('/api-keys', ensureAuthenticated, apiKeyRouter);
app.use('/auth', authRouter);

runCron();
heartbeat();


app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
