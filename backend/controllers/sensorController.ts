import PrismaClient from '../utils/db'
import {Request, Response} from "express";

const getSensorsValues = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(400).json({message: "Missing id"})
        }

        const sensorsValues = await PrismaClient.sensorData.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!sensorsValues) {
            return res.status(404).json({message: "Sensors values not found"})
        }

        return res.status(200).json(sensorsValues)
    } catch (error: Error | any) {
        return res.status(500).json({message: error.message})
    }
}

const createSensorsValues = async (req: Request, res: Response) => {
    try {
        const {temperature, humidity, soilMoisture} = req.body;
        if (!temperature || !humidity || !soilMoisture) {
            return res.status(400).json({message: "Missing parameters"});
        }

        const parsedTemperature = parseFloat(temperature);
        const parsedHumidity = parseFloat(humidity);
        const parsedSoilMoisture = parseFloat(soilMoisture);

        if (isNaN(parsedTemperature) || isNaN(parsedHumidity) || isNaN(parsedSoilMoisture)) {
            return res.status(400).json({message: "Invalid parameters"});
        }

        await PrismaClient.sensorData.create({
            data: {
                temperature: parsedTemperature,
                humidity: parsedHumidity,
                soilMoisture: parsedSoilMoisture
            }
        });

        return res.status(201).json("Successfully created");
    } catch (error: Error | any) {
        return res.status(500).json({message: error.message});
    }
};

export {getSensorsValues, createSensorsValues}