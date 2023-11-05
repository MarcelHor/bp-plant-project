import express from 'express';
import imageRoutes from './routes/imageRoutes';

const app = express();
const PORT = 3000;

app.use('/images', imageRoutes);

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
