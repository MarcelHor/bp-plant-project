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
        const imageUri = `/images/${image}`;
        const thumbnailUri = `/thumbnails/${thumbnail}`;

        return res.status(200).json({imageUri, thumbnailUri, ...latestData});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const getLatestDate = async (req: Request, res: Response) => {
    try {
        const latestData = await prisma.sensorData.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!latestData) {
            return res.status(404).json({message: 'No data found'});
        }

        return res.status(200).json({createdAt: latestData.createdAt});
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
        const imageUri = `/images/${image}`;
        const thumbnailUri = `/thumbnails/${thumbnail}`;

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

        const totalThumbnails = await prisma.sensorData.count();
        const totalPages = Math.ceil(totalThumbnails / limit);


        if (page > totalPages) {
            return res.status(404).json({message: 'Page not found'});
        }


        const thumbnails = await Promise.all(
            sensorData.map(async (data) => {
                const thumbnail = await getThumbnailById(data.id);
                return {
                    id: data.id,
                    createdAt: data.createdAt,
                    thumbnailUri: `/thumbnails/${thumbnail}`
                };
            })
        );

        return res.status(200).json({
            totalPages,
            currentPage: page,
            thumbnails
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
};

export const getChartData = async (req: Request, res: Response) => {
    const {from, to} = req.query;
    if (!from || !to) {
        return res.status(400).json({message: 'Missing from or to parameter'});
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    //! This is a hack to fix the timezone issue
    toDate.setHours(toDate.getHours() + 1);
    fromDate.setHours(fromDate.getHours() + 1);

    try {
        const data = await prisma.sensorData.findMany({
            where: {
                createdAt: {
                    gte: fromDate,
                    lte: toDate
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (data.length === 0) {
            return res.status(404).json({message: 'No data found'});
        }

        if (Math.abs(new Date(from as string).getTime() - new Date(to as string).getTime()) > 259200000) {
            const filteredData = data.filter((data, index) => index % 10 === 0);
            data.length = 0;
            data.push(...filteredData);
        }

        const ids = data.map((data) => data.id);
        const labels = data.map((data) => data.createdAt.toISOString());
        const temperatureData = data.map((data) => data.temperature);
        const humidityData = data.map((data) => data.humidity);
        const soilMoistureData = data.map((data) => data.soilMoisture);
        const lightData = data.map((data) => data.light);

        return res.status(200).json({
            ids,
            labels,
            temperatureData,
            humidityData,
            soilMoistureData,
            lightData
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const getClosestThumbnails = async (req: Request, res: Response) => {
    const {dateTime} = req.query;

    if (!dateTime) {
        return res.status(400).json({message: 'Missing dateTime parameter'});
    }

    try {
        const closestData = await prisma.sensorData.findFirst({
            where: {
                createdAt: {
                    lte: new Date(dateTime as string)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!closestData) {
            return res.status(404).json({message: 'Thumbnail not found'});
        }

        const additionalData = await prisma.sensorData.findMany({
            where: {
                createdAt: {
                    lt: closestData.createdAt
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const combinedData = [closestData, ...additionalData];

        const thumbnails = await Promise.all(
            combinedData.map(async (data) => {
                const thumbnail = await getThumbnailById(data.id);
                return {
                    id: data.id,
                    createdAt: data.createdAt,
                    thumbnailUri: `/thumbnails/${thumbnail}`
                };
            })
        );

        return res.status(200).json({
            thumbnails,
            currentPage: 1,
            totalPages: 1
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
};

