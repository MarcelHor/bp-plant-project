import {prismaMock} from "../utils/prismaMock";
import {Request, Response} from "express";
import {
    getById,
    getChartData,
    getClosestThumbnails,
    getLatest,
    getLatestDate,
    getThumbnails
} from "../controllers/sensorDataController";

jest.mock("../utils/imageUtils", () => ({
    getImageById: jest.fn().mockResolvedValue("mockedImage.jpg"),
    getThumbnailById: jest.fn().mockResolvedValue("mockedThumbnail.jpg")
}));

describe('getLatest', () => {
    it('should return the latest sensor data with image and thumbnail URIs', async () => {
        const mockData = {
            id: 'unique-id',
            temperature: 25,
            humidity: 50,
            light: 300,
            soilMoisture: 40,
            createdAt: new Date()
        };

        (prismaMock.sensorData as any).findFirst.mockResolvedValue(mockData);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getLatest(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            imageUri: `/images/mockedImage.jpg`,
            thumbnailUri: `/thumbnails/mockedThumbnail.jpg`,
            ...mockData
        });
    });
    it('should return 404 if no data is found', async () => {
        (prismaMock.sensorData as any).findFirst.mockResolvedValue(null);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getLatest(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'No data found'});
    });
    it('should return 500 if an error occurs', async () => {
        (prismaMock.sensorData as any).findFirst.mockRejectedValue(new Error('Database error'));

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getLatest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
});

describe('getLatestDate', () => {
    it('should return the date of the latest sensor data', async () => {
        const mockData = {
            createdAt: new Date()
        };

        (prismaMock.sensorData as any).findFirst.mockResolvedValue(mockData);
        (prismaMock.sensorData as any).mockResolvedValue(mockData);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getLatestDate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({createdAt: mockData.createdAt});
    });
    it('should return 404 if no data is found', async () => {
        (prismaMock.sensorData as any).findFirst.mockResolvedValue(null);

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getLatestDate(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'No data found'});
    });
    it('should return 500 if an error occurs', async () => {
        (prismaMock.sensorData as any).findFirst.mockRejectedValue(new Error('Database error'));

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getLatestDate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
});

describe('getById', () => {
    it('should return sensor data with image and thumbnail URIs by ID', async () => {
        const mockData = {
            id: 'unique-id',
            temperature: 25,
            createdAt: new Date()
        };

        (prismaMock.sensorData as any).findUnique.mockResolvedValue(mockData);

        const req = { params: { id: 'unique-id' } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 404 if no data is found', async () => {
        (prismaMock.sensorData as any).findUnique.mockResolvedValue(null);

        const req = { params: { id: 'unique-id' } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Data not found'});
    });
    it('should return 500 if an error occurs', async () => {
        (prismaMock.sensorData as any).findUnique.mockRejectedValue(new Error('Database error'));

        const req = { params: { id: 'unique-id' } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
});

describe('getThumbnails', () => {
    it('should return a paginated list of thumbnails', async () => {
        const mockData = [
            { id: 'id1', createdAt: new Date() },
        ];

        (prismaMock.sensorData as any).findMany.mockResolvedValue(mockData);
        (prismaMock.sensorData as any).count.mockResolvedValue(10);

        const req = { query: { page: '1', limit: '5' } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 500 if an error occurs', async () => {
        (prismaMock.sensorData as any).findMany.mockRejectedValue(new Error('Database error'));

        const req = { query: { page: '1', limit: '5' } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
    it('should return 404 if no data is found', async () => {
        (prismaMock.sensorData as any).findMany.mockResolvedValue([]);

        const req = { query: { page: '1', limit: '5' } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'No thumbnails found'});
    });
});

describe('getChartData', () => {
    it('should return chart data for given date range', async () => {
        const mockData = [
            { id: 'id1', createdAt: new Date('2021-01-01'), temperature: 25, humidity: 50, soilMoisture: 30, light: 200 },
            // Další záznamy...
        ];

        (prismaMock.sensorData as any).findMany.mockResolvedValue(mockData);

        const req = {
            query: { from: '2021-01-01', to: '2021-01-31' }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getChartData(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
    it('should return 400 if from or to parameter is missing', async () => {
        const req = {
            query: { from: '2021-01-01' }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getChartData(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Missing from or to parameter'});
    });
    it('should return 500 if an error occurs', async () => {
        (prismaMock.sensorData as any).findMany.mockRejectedValue(new Error('Database error'));

        const req = {
            query: { from: '2021-01-01', to: '2021-01-31' }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getChartData(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
});

describe('getClosestThumbnails', () => {
    it('should return closest thumbnails to the given dateTime', async () => {
        const mockClosestData = { id: 'closest-id', createdAt: new Date('2021-01-01') };
        const mockAdditionalData = [
            { id: 'additional-id1', createdAt: new Date('2020-12-31') },
            // Další záznamy...
        ];

        (prismaMock.sensorData as any).findFirst.mockResolvedValue(mockClosestData);
        (prismaMock.sensorData as any).findMany.mockResolvedValue(mockAdditionalData);

        const req = {
            query: { dateTime: '2021-01-01T12:00:00' }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getClosestThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
    it('should return 400 if dateTime parameter is missing', async () => {
        const req = {
            query: {}
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getClosestThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Missing dateTime parameter'});
    });
    it('should return 404 if no data is found', async () => {
        (prismaMock.sensorData as any).findFirst.mockResolvedValue(null);

        const req = {
            query: { dateTime: '2021-01-01T12:00:00' }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getClosestThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Thumbnail not found'});
    });
    it('should return 500 if an error occurs', async () => {
        (prismaMock.sensorData as any).findFirst.mockRejectedValue(new Error('Database error'));

        const req = {
            query: { dateTime: '2021-01-01T12:00:00' }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getClosestThumbnails(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Something went wrong'});
    });
});





