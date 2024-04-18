import {prismaMock} from "../utils/prismaMock";
import {getPlantSettings, setWatering, setPlantSettings} from "../controllers/plantSettingsController";
import {Request, Response} from "express";


describe('getPlantSettings', () => {
    it('should return plant settings if found', async () => {
        const mockSettings = { captureInterval: 10, wateringDuration: 5, waterPlant: false, automaticWatering: false, wateringStartMoisture: 0, stopLight: 0 };
        (prismaMock.plantSettings as any).findFirst.mockResolvedValue(mockSettings);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await getPlantSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSettings);
    });

    it('should return 404 if no plant settings found', async () => {
        (prismaMock.plantSettings as any).findFirst.mockResolvedValue(null);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await getPlantSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Plant settings not found' });
    });
    it('should return 500 if something went wrong', async () => {
        (prismaMock.plantSettings as any).findFirst.mockRejectedValue(new Error('Failed to connect to database'));

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await getPlantSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
});

describe('setWatering', () => {
    it('should update waterPlant setting', async () => {
        const mockSettings = { id: 1, waterPlant: true };
        (prismaMock.plantSettings as any).findFirst.mockResolvedValue(mockSettings);
        (prismaMock.plantSettings as any).update.mockResolvedValue(mockSettings);

        const req = {
            body: { waterPlant: true },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setWatering(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSettings);
    });
    it('should return 404 if no plant settings found', async () => {
        (prismaMock.plantSettings as any).findFirst.mockResolvedValue(null);

        const req = {
            body: {waterPlant: true},
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setWatering(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Plant settings not found'});
    });
    it('should return 500 if something went wrong', async () => {
        (prismaMock.plantSettings as any).findFirst.mockRejectedValue(new Error('Failed to connect to database'));

        const req = {
            body: {waterPlant: true},
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setWatering(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
});

describe('setPlantSettings', () => {
    it('should create new plant settings if none exist', async () => {
        (prismaMock.plantSettings as any).findFirst.mockResolvedValue(null)
        const mockSettings = { captureInterval: 10, wateringDuration: 5 , automaticWatering: false, wateringStartMoisture: 0, stopLight: 0, waterPlant: false};
        (prismaMock.plantSettings as any).create.mockResolvedValue(mockSettings);

        const req = {
            body: { captureInterval: '10', wateringDuration: '5' , automaticWatering: 'false', wateringStartMoisture: '0', stopLight: '0'},
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setPlantSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Plant settings updated' });
    });

    it('should update existing plant settings', async () => {
        const mockSettings = { id: 1, captureInterval: 10, wateringDuration: 5 , automaticWatering: false, wateringStartMoisture: 0, stopLight: 0, waterPlant: false};
        (prismaMock.plantSettings as any).findFirst.mockResolvedValue(mockSettings);
        (prismaMock.plantSettings as any).update.mockResolvedValue(mockSettings);

        const req = {
            body: { captureInterval: '10', wateringDuration: '5' , automaticWatering: 'false', wateringStartMoisture: '0', stopLight: '0'},
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setPlantSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Plant settings updated' });
    });
    it('should return 400 if missing required fields', async () => {
        const req = {
            body: {},
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setPlantSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });
});



