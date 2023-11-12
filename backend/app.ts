import express from 'express';
import uploadRoute from "./routes/uploadRoute";
import sensorDataRouter from "./routes/sensorDataRoutes";
import cors from 'cors';

const app = express();
const PORT = 3000;
// const HOST = '192.168.137.1';
const HOST = 'localhost';
app.use(express.json());
app.use(cors());
app.use('/upload', uploadRoute);
app.use('/sensor-data', sensorDataRouter);
app.use('/images', express.static('./static/images'));
app.use('/thumbnails', express.static('./static/thumbnails'));

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
