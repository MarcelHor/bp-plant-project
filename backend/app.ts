import express from 'express';
import uploadRoute from "./routes/uploadRoute";
import sensorDataRouter from "./routes/sensorDataRoutes";
import timelapsesRouter from "./routes/timelapsesRoutes";
import emailSettingsRouter from "./routes/emailSettingsRoutes";
import eventRouter from "./routes/eventRoute";
import plantSettingsRouter from "./routes/plantSettingsRoutes";
import {runCron} from "./utils/cronjobs/notifications";
import {heartbeat} from "./controllers/eventController";
import {checkStaticFolder} from "./utils/utils";
import cors from 'cors';
// import plantAi from "./utils/plantAi";
import session from 'express-session';
import {authRouter, ensureAuthenticated} from "./routes/authRoute";

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
    cookie: { secure: false }
}));

app.use(express.json());
app.use('/upload', ensureAuthenticated,  uploadRoute);
app.use('/sensor-data', ensureAuthenticated,  sensorDataRouter);
app.use('/images', ensureAuthenticated,  express.static('./static/images'));
app.use('/thumbnails', ensureAuthenticated,  express.static('./static/thumbnails'));
app.use('/timelapses', ensureAuthenticated,  timelapsesRouter);
app.use('/email-settings', ensureAuthenticated,  emailSettingsRouter);
app.use('/events', ensureAuthenticated,  eventRouter);
app.use('/plant-settings', ensureAuthenticated,  plantSettingsRouter);
// app.use('/', ensureAuthenticated, plantAi);
app.use('/auth', authRouter);

runCron();
heartbeat();
checkStaticFolder();

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
