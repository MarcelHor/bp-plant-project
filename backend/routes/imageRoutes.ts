import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware';
import { processImage } from '../utils/imageProcessor';

const router = express.Router();

router.post('/upload', uploadMiddleware, async (req, res) => {
    try {
        if (!req.file) throw new Error("No file provided!");

        await processImage(req.file.path, `./uploads/thumbnail-${req.file.filename}`);
        res.send('Obrázek byl úspěšně nahrán a náhled byl vytvořen.');
    } catch (error : Error | any) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
