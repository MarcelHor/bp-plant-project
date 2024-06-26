import {Request, Response} from 'express';
import prisma from "../utils/db";

export const getPlantSettings = async (req: Request, res: Response) => {
    try {
        const plantSettings = await prisma.plantSettings.findFirst();
        if (!plantSettings) {
            return res.status(404).json({message: 'Plant settings not found'});
        }

        return res.status(200).json(plantSettings);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const setWatering = async (req: Request, res: Response) => {
    const {waterPlant} = req.body;
    if (waterPlant === undefined) {
        return res.status(400).json({message: 'Missing waterPlant'});
    }
    try {
        const plantSettings = await prisma.plantSettings.findFirst();
        if (!plantSettings) {
            return res.status(404).json({message: 'Plant settings not found'});
        }

        const newPlantSettings = await prisma.plantSettings.update({
            where: {
                id: plantSettings.id
            },
            data: {
                waterPlant: waterPlant
            }
        });

        return res.status(200).json(newPlantSettings);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const setPlantSettings = async (req: Request, res: Response) => {
    const {captureInterval, wateringDuration, automaticWatering, wateringStartMoisture, stopLight} = req.body;

    if (captureInterval === undefined || wateringDuration === undefined || automaticWatering === undefined || wateringStartMoisture === undefined || stopLight === undefined) {
        return res.status(400).json({message: 'Missing required fields'});
    }

    const captureIntervalNumber = Number(captureInterval);
    const wateringDurationNumber = Number(wateringDuration);
    const automaticWateringBoolean = Boolean(automaticWatering);
    const wateringStartMoistureNumber = Number(wateringStartMoisture);
    const stopLightNumber = Number(stopLight);

    try {
        const plantSettings = await prisma.plantSettings.findFirst();
        if (plantSettings) {
            await prisma.plantSettings.update({
                where: {
                    id: plantSettings.id
                },
                data: {
                    captureInterval: captureIntervalNumber,
                    wateringDuration: wateringDurationNumber,
                    automaticWatering: automaticWateringBoolean,
                    wateringStartMoisture: wateringStartMoistureNumber,
                    stopLight: stopLightNumber
                }
            });
        } else {
            await prisma.plantSettings.create({
                data: {
                    captureInterval: captureInterval,
                    wateringDuration: wateringDuration,
                    automaticWatering: automaticWatering,
                    wateringStartMoisture: wateringStartMoisture,
                    stopLight: stopLight,
                    waterPlant: false
                }
            });
        }

        return res.status(200).json({message: 'Plant settings updated'});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}