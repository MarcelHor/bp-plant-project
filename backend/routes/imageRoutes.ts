import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware';
import {processImage} from '../utils/imageProcessor';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const image = req.file;
        if (!image) {
            res.status(400).json({error: 'No image file'});
        }

        //check if image is valid

    } catch (error: Error | any) {
        res.status(400).send({error: error.message});
    }
});

export default router;
