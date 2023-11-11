import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import checkAndCleanStorage from "../utils/imageClean";
import {createThumbnail, saveImage} from "../utils/imageProcessor";
import {randomUUID} from "crypto";

const prisma = new PrismaClient();

export const processImageAndSensorData = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No image provided or invalid image type'});
        }

        setImmediate(async () => {
            await checkAndCleanStorage();
        });

        const {temperature, humidity, soilMoisture, createdAt} = req.body;
        if (!temperature || !humidity || !soilMoisture || !createdAt) {
            return res.status(400).json({error: 'No sensor data provided'});
        }
        const parsedTemperature = parseFloat(temperature);
        const parsedHumidity = parseFloat(humidity);
        const parsedSoilMoisture = parseFloat(soilMoisture);
        const parsedCreatedAt = Date.parse(createdAt);

        if (isNaN(parsedTemperature) || isNaN(parsedHumidity) || isNaN(parsedSoilMoisture) || isNaN(parsedCreatedAt)) {
            return res.status(400).json({error: "Invalid sensor parameters"});
        }

        const sensorId = randomUUID();
        // const fileDate = parsedCreatedAt.toString().replace(/:/g, '-');
        const fileName = `${sensorId}-${parsedCreatedAt}.jpeg`;

        await prisma.sensorData.create({
            data: {
                id: sensorId,
                temperature: parsedTemperature,
                humidity: parsedHumidity,
                soilMoisture: parsedSoilMoisture,
                createdAt: new Date(parsedCreatedAt),
            }
        });

        await createThumbnail(req.file, fileName);
        await saveImage(req.file, fileName);
        res.status(200).json({message: 'Image and sensor data processed'});
    } catch (error: any) {
        console.log(error);
        if (error.message === 'Thumbnail already exists' || error.message === 'Image already exists') {
            return res.status(409).json({error: "Image already exists"});
        }
        res.status(500).json({error: 'Internal server error'});
    }
};

