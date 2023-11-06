import {createThumbnail, saveImage} from '../utils/imageProcessor';
import {Request, Response} from 'express';

export async function uploadImage(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No image provided or invalid image type'});
        }

        await createThumbnail(req.file);
        await saveImage(req.file);

        res.status(200).json({message: 'Image uploaded'});
    } catch (error: any) {
        if (error.message === 'Thumbnail already exists' || error.message === 'Image already exists') {
            return res.status(409).json({error: "Image already exists"});
        }
        res.status(500).json({error: 'Internal server error or invalid image type'});
    }
}
