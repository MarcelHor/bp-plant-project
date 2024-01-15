import {Request, Response} from "express";
import prisma from "../utils/db";
import checkAndCleanStorage from "../utils/cleanStorage";
import {createThumbnail, saveImage} from "../utils/imageUtils";
import {randomUUID} from "crypto";
import {sendEventMessage} from "./eventController";

const validateSensorData = (data: any) => {
    const {temperature, humidity, createdAt, light, soilMoisture} = data;

    if (!temperature || !humidity || !light || !soilMoisture) {
        throw new Error('Invalid sensor data');
    }

    return {
        temperature: parseFloat(temperature),
        soilMoisture: parseFloat(soilMoisture),
        humidity: parseFloat(humidity),
        light: parseFloat(light),
        createdAt: createdAt ? new Date(createdAt) : Date.now()
    }
}


export const processImageAndSensorData = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No image provided or invalid image type'});
        }

        setImmediate(checkAndCleanStorage);

        const sensorData = validateSensorData(req.body);

        const sensorId = randomUUID();

        const fileName = `${sensorId}-${sensorData.createdAt}.jpeg`;

        await createThumbnail(req.file, fileName);
        await saveImage(req.file, fileName);

        await prisma.sensorData.create({
            data: {
                id: sensorId,
                ...sensorData,
                createdAt: new Date(sensorData.createdAt)
            }
        });

        sendEventMessage({ message: 'new-data-uploaded'});

        res.status(200).json({message: 'Image and sensor data processed'});
    } catch (error: Error | any) {
        console.log(error);
        if (error.message === 'Thumbnail already exists' || error.message === 'Image already exists') {
            return res.status(409).json({error: "Image already exists"});
        } else if (error.message === 'Invalid sensor data') {
            return res.status(400).json({error: "Invalid sensor data"});
        }
        res.status(500).json({error: 'Internal server error'});
    }
};

