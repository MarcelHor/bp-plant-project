import express from 'express';

import {uploadRoute} from "./routes/uploadRoute";
import cors from 'cors';

const app = express();
const PORT = 3000;
const HOST = 'localhost';

app.use(express.json());
app.use(cors());
app.use('/upload', uploadRoute);

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
