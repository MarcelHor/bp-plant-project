import {prismaMock} from "../utils/prismaMock";
import {Response, Request} from "express";
import {createApiKey, deleteApiKey, getApiKey, getApiKeys} from "../controllers/apiKeyController";


describe('getApiKeys', () => {
    it('should return a list of api keys', async () => {
        const apiKeys = [
            {id: 1, key: 'some-key-1', lastUsed: new Date(), usageCount: 0, createdAt: new Date()},
            {id: 2, key: 'some-key-2', lastUsed: new Date(), usageCount: 0, createdAt: new Date()}
        ] as any;

        (prismaMock.apiKey as any).findMany.mockResolvedValue(apiKeys);

        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        const req = {} as Request;

        await getApiKeys(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {id: 1, lastUsed: apiKeys[0].lastUsed, usageCount: 0},
            {id: 2, lastUsed: apiKeys[1].lastUsed, usageCount: 0}
        ]);
    });
    it('should return an empty list if no api keys are found', async () => {
        (prismaMock.apiKey as any).findMany.mockResolvedValue([]);

        const req = {} as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await getApiKeys(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });
});

describe('getApiKey', () => {
    it('should return an API key if found', async () => {
        const apiKey = {
            id: 1,
            key: 'some-key-1',
            lastUsed: new Date(),
            usageCount: 0,
            createdAt: new Date()
        };

        (prismaMock.apiKey as any).findUnique.mockResolvedValue(apiKey);

        const req = { params: { id: '1' } } as unknown as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await getApiKey(req, res);

        expect(res.json).toHaveBeenCalledWith(apiKey);
    });

    it('should return 404 if API key is not found', async () => {
        (prismaMock.apiKey as any).findUnique.mockResolvedValue(null);

        const req = { params: { id: '999' } } as unknown as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await getApiKey(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('API klíč nebyl nalezen.');
        expect(res.json).not.toHaveBeenCalled();
    });
    it('should return 400 if the provided ID is not valid', async () => {
        const req = { params: { id: 'invalid-id' } } as unknown as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await getApiKey(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Je vyžadováno ID klíče.');
    });
});

describe('createApiKey', () => {
    it('should create a new API key and return its details without the key itself', async () => {
        const newApiKey = {
            id: 3,
            key: 'new-key-uuid',
            lastUsed: null,
            usageCount: 0,
            createdAt: new Date()
        };

        (prismaMock.apiKey as any).create.mockResolvedValue(newApiKey);
        (prismaMock.apiKey as any).findUnique.mockResolvedValue(newApiKey);

        const req = {} as unknown as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await createApiKey(req, res);

        expect(res.json).toHaveBeenCalledWith({
            id: newApiKey.id,
            lastUsed: newApiKey.lastUsed,
            usageCount: newApiKey.usageCount
        });
    });
    it('should return 404 if the newly created API key is not found', async () => {
        const newApiKey = {
            id: 3,
            key: 'new-key-uuid',
            lastUsed: null,
            usageCount: 0,
            createdAt: new Date()
        };

        (prismaMock.apiKey as any).create.mockResolvedValue(newApiKey);
        (prismaMock.apiKey as any).findUnique.mockResolvedValue(null);

        const req = {} as unknown as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await createApiKey(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('API klíč nebyl nalezen.');
    });
});


describe('deleteApiKey', () => {
    it('should delete an API key and return a confirmation message', async () => {
        const idToDelete = 2;
        (prismaMock.apiKey as any).findUnique.mockResolvedValue({ id: idToDelete });
        (prismaMock.apiKey as any).delete.mockResolvedValue({ id: idToDelete });

        const req = { params: { id: `${idToDelete}` } } as unknown as Request;
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        await deleteApiKey(req, res);

        expect(res.send).toHaveBeenCalledWith('API klíč byl smazán.');
        // @ts-ignore
        expect(prismaMock.apiKey.delete).toHaveBeenCalledWith({ where: { id: idToDelete } });
    });

    it('should return 404 if API key to delete is not found', async () => {
        (prismaMock.apiKey as any).findUnique.mockResolvedValue(null);

        const req = { params: { id: '999' } } as unknown as Request;
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        await deleteApiKey(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('API klíč nebyl nalezen.');
        expect(prismaMock.apiKey.delete).not.toHaveBeenCalled();
    });
    it('should handle attempts to delete a non-existent API key gracefully', async () => {
        (prismaMock.apiKey as any).findUnique.mockResolvedValue(null);

        const req = { params: { id: '3' } } as unknown as Request;
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        await deleteApiKey(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('API klíč nebyl nalezen.');
    });
    it('should return 400 if the provided ID is not valid', async () => {
        const req = { params: { id: 'invalid-id' } } as unknown as Request;
        const res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;

        await deleteApiKey(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Je vyžadováno ID klíče.');
    });
});






