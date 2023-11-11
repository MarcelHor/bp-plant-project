import {Request, Response} from 'express';
import prisma from "../utils/db";
import {getImageById} from "../utils/imageUtils";

export const getLatest = async (req: Request, res: Response) => {
    try {
        const latestData = await prisma.sensorData.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!latestData) {
            return res.status(404).json({message: 'No data found'});
        }

        const imagePath = await getImageById(latestData.id);
        const imageUri = `${req.protocol}://${req.get('host')}/images/${imagePath}`;

        return res.status(200).json({imageUri, ...latestData});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}