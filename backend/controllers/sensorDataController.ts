import {Request, Response} from 'express';
import prisma from "../utils/db";
import {getImageById, getThumbnailById} from "../utils/imageUtils";

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

        const image = await getImageById(latestData.id);
        const thumbnail = await getThumbnailById(latestData.id);
        const imageUri = `${req.protocol}://${req.get('host')}/images/${image}`;
        const thumbnailUri = `${req.protocol}://${req.get('host')}/thumbnails/${thumbnail}`;

        return res.status(200).json({imageUri, thumbnailUri, ...latestData});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const getById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const data = await prisma.sensorData.findUnique({
            where: {
                id
            }
        });

        if (!data) {
            return res.status(404).json({message: 'Data not found'});
        }

        const image = await getImageById(data.id);
        const thumbnail = await getThumbnailById(data.id);
        const imageUri = `${req.protocol}://${req.get('host')}/images/${image}`;
        const thumbnailUri = `${req.protocol}://${req.get('host')}/thumbnails/${thumbnail}`;

        return res.status(200).json({imageUri, thumbnailUri, ...data});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const getThumbnails = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        const sensorData = await prisma.sensorData.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            }
        });


        if (sensorData.length === 0) {
            return res.status(404).json({message: 'No thumbnails found'});
        }

        const thumbnails = await Promise.all(
            sensorData.map(async (data) => {
                const thumbnail = await getThumbnailById(data.id);
                return {
                    id: data.id,
                    createdAt: data.createdAt,
                    thumbnailUri: `${req.protocol}://${req.get('host')}/thumbnails/${thumbnail}`
                };
            })
        );

        return res.status(200).json({
            page,
            limit,
            thumbnails
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
};

export const getChartData = async (req: Request, res: Response) => {
    const {from, to} = req.query;

    try {
        const data = await prisma.sensorData.findMany({
            where: {
                createdAt: {
                    gte: new Date(from as string),
                    lte: new Date(to as string)
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (data.length === 0) {
            return res.status(404).json({message: 'No data found'});
        }

        const temperatureData = data.map(d => d.temperature);
        const humidityData = data.map(d => d.humidity);
        const soilMoistureData = data.map(d => d.soilMoisture);
        const labels = data.map(d => d.createdAt);

        const chartData = {
            labels,
            temperatureData,
            humidityData,
            soilMoistureData
        };

        return res.status(200).json(chartData);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

// export const getClosestThumbnail = async (req: Request, res: Response) => {
//     const { dateTime } = req.query;
//
//     try {
//         const closestData = await prisma.sensorData.findFirst({
//             where: {
//                 createdAt: {
//                     lte: new Date(dateTime as string)
//                 }
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });
//
//         if (!closestData) {
//             return res.status(404).json({ message: 'Thumbnail not found' });
//         }
//
//
//         return res.status(200).json({ thumbnailUri, ...closestData });
//     } catch (error: any) {
//         console.log(error);
//         return res.status(500).json({ message: 'Something went wrong' });
//     }
// };
