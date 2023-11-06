import {Router} from 'express';
import multer from "multer";
import sharp from "sharp";
import path from 'path';

const imageRoutes = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

imageRoutes.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({error: 'No image uploaded'});
            return;
        }

        const imagePath = path.join('./static/images', req.file.originalname);
        const thumbnailPath = path.join('./static/thumbnails', `thumbnail-${req.file.originalname}`);

        await sharp(imagePath)
            .resize(200, 200)
            .toFile(thumbnailPath);

        res.status(200).json({message: 'Image uploaded'});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

export {imageRoutes};
