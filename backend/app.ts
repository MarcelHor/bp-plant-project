import express from 'express';
import uploadRoute from "./routes/uploadRoute";
import sensorDataRouter from "./routes/sensorDataRoutes";
import timelapsesRouter from "./routes/timelapsesRoutes";
import emailSettingsRouter from "./routes/emailSettingsRoutes";
import {runCron} from "./utils/cronjobs/notifications";
import cors from 'cors';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';
app.use(express.json());
app.use(cors());
app.use('/upload', uploadRoute);
app.use('/sensor-data', sensorDataRouter);
app.use('/images', express.static('./static/images'));
app.use('/thumbnails', express.static('./static/thumbnails'));
app.use('/timelapses', timelapsesRouter);
app.use('/email-settings', emailSettingsRouter);

runCron();

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
