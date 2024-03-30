import {prismaMock} from "../utils/prismaMock";
import {Response, Request} from "express";
import {getEmailSettings, setEmailSettings} from "../controllers/emailSettingsController";

describe('getEmailSettings', () => {
    it('should return email settings if found', async () => {
        const emailSettings = {
            subject: 'Test Subject',
            recipient: 'test@example.com',
            cronTime: '10:00'
        };

        (prismaMock.emailSettings as any).findFirst.mockResolvedValue(emailSettings);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await getEmailSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(emailSettings);
    });

    it('should return 404 if email settings not found', async () => {
        (prismaMock.emailSettings as any).findFirst.mockResolvedValue(null);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await getEmailSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Email settings not found'});
    });
});


describe('setEmailSettings', () => {
    it('should create new email settings if none exist', async () => {
        (prismaMock.emailSettings as any).findFirst.mockResolvedValue(null);
        (prismaMock.emailSettings as any).create.mockResolvedValue({
            subject: 'New Subject',
            recipient: 'new@example.com',
            cronTime: '12:00'
        });


        const req = {
            body: {
                subject: 'New Subject',
                recipient: 'new@example.com',
                cronTime: '12:00'
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setEmailSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'Email settings updated'});
    });

    it('should return 400 if required fields are missing', async () => {
        const req = {
            body: {} // Missing subject, recipient, and cronTime
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setEmailSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Missing subject, recipient or cronTime'});
    });

    it('should return 400 if cronTime is not in correct format', async () => {
        const req = {
            body: {
                subject: 'Test Subject',
                recipient: 'test@example.com',
                cronTime: 'invalid-time'
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await setEmailSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Cron time must be in format 00:00'});
    });
});
