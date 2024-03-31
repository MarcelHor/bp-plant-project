import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import * as imageUtils from '../utils/imageUtils';
import { sendEventMessage } from '../controllers/eventController';
import { prismaMock } from '../utils/prismaMock';
import {processImageAndSensorData} from "../controllers/uploadController";
import {Request, Response} from 'express';

jest.mock('fs/promises');
jest.mock('path');
jest.mock('crypto', () => ({
    randomUUID: jest.fn()
}));
jest.mock('../utils/imageUtils');
jest.mock('../controllers/eventController');

describe('processImageAndSensorData', () => {
    it('should process image and sensor data successfully', async () => {

        const mockFile = { buffer: Buffer.from('test'), mimetype: 'image/jpeg' };
        const mockSensorId = '123e4567-e89b-12d3-a456-426614174000';
        jest.mocked(randomUUID).mockReturnValue(mockSensorId);
        jest.mocked(imageUtils.createThumbnail).mockResolvedValue(undefined);
        jest.mocked(imageUtils.saveImage).mockResolvedValue(undefined);

        (prismaMock.sensorData as any).create.mockResolvedValue({ id: mockSensorId,});

        const req = {
            file: mockFile,
            body: {
                temperature: '25',
                humidity: '50',
                light: '300',
                soilMoisture: '20',
                createdAt: new Date().toISOString()
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await processImageAndSensorData(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Image and sensor data processed' });
        expect((prismaMock.sensorData as any).create).toHaveBeenCalled();
        expect(imageUtils.createThumbnail).toHaveBeenCalled();
        expect(imageUtils.saveImage).toHaveBeenCalled();
        expect(sendEventMessage).toHaveBeenCalledWith({ message: 'new-data-uploaded' });
    });
    it('should return 400 if sensor data is invalid', async () => {
        const req = {
            file: { buffer: Buffer.from('test'), mimetype: 'image/jpeg' },
            body: {
                temperature: '25',
                humidity: '50',
                light: '',
                soilMoisture: '20',
                createdAt: ''
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await processImageAndSensorData(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sensor data' });
    });
    it('should return 400 if no image is provided', async () => {
        const req = {
            body: {
                temperature: '25',
                humidity: '50',
                light: '300',
                soilMoisture: '20',
                createdAt: new Date().toISOString()
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await processImageAndSensorData(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No image provided or invalid image type' });
    });
    it('should return 500 if an error occurs', async () => {
        const req = {
            file: { buffer: Buffer.from('test'), mimetype: 'image/jpeg' },
            body: {
                temperature: '25',
                humidity: '50',
                light: '300',
                soilMoisture: '20',
                createdAt: new Date().toISOString()
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        jest.mocked(imageUtils.saveImage).mockRejectedValue(new Error('Test error'));

        await processImageAndSensorData(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
