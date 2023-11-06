import express from 'express';
import {imageRoutes} from './routes/imageRoutes';
import {sensorRoutes} from "./routes/sensorRoutes";
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/images', imageRoutes);
app.use('/sensors', sensorRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
