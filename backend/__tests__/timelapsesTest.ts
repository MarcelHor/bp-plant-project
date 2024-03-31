import {
    deleteTimelapse,
    getTimelapses,
    streamTimelapseEndpoint,
    createTimelapseEndpoint
} from "../controllers/timelapsesController";
import {prismaMock} from "../utils/prismaMock";
import * as fs from "fs";
import * as path from "path";
import {Request, Response} from "express";
import prisma from "../utils/db";

jest.mock("fs", () => ({
    promises: {},
    createReadStream: jest.fn().mockReturnValue({
        pipe: jest.fn(),
    }),
    statSync: jest.fn(),
    unlink: jest.fn(),
    access: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn(),
}));


jest.mock("path");

jest.mock("crypto", () => ({
    randomUUID: jest.fn(() => "mock-uuid")
}));

jest.mock("../utils/imageUtils", () => ({
    getThumbnailById: jest.fn(() => Promise.resolve("mock-thumbnail.jpg")),
}));

jest.mock("../utils/db", () => ({
    prisma: {
        timelapseData: {
            findMany: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    }
}));

describe('streamTimelapseEndpoint', () => {
    it('streams a timelapse video', async () => {
        const req = {
            params: {name: 'video.mp4'},
            headers: {range: 'bytes=0-1000'},
            query: {},
        } as unknown as Request;
        const res = {
            writeHead: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        (fs.statSync as jest.Mock).mockReturnValue({size: 1001});

        await streamTimelapseEndpoint(req, res);

        expect(res.writeHead).toHaveBeenCalledWith(206, expect.any(Object));
    });
    it('streams a timelapse video with no range', async () => {
        const req = {
            params: {name: 'video.mp4'},
            headers: {},
            query: {},
        } as unknown as Request;
        const res = {
            writeHead: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        (fs.statSync as jest.Mock).mockReturnValue({size: 1001});

        await streamTimelapseEndpoint(req, res);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    });
    it('streams a timelapse video with invalid range', async () => {
        const req = {
            params: {name: 'video.mp4'},
            headers: {range: 'bytes=1000-0'},
            query: {},
        } as unknown as Request;
        const res = {
            writeHead: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        (fs.statSync as jest.Mock).mockReturnValue({size: 1001});

        await streamTimelapseEndpoint(req, res);

        expect(res.writeHead).toHaveBeenCalledWith(206, expect.any(Object));
    });
    it('returns 416 when requested range is beyond file size', async () => {
        const req = {
            params: {name: 'video.mp4'},
            headers: {range: 'bytes=2000-3000'},
            query: {},
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        (fs.statSync as jest.Mock).mockReturnValue({size: 1001});

        await streamTimelapseEndpoint(req, res);

        expect(res.status).toHaveBeenCalledWith(416);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });
    it('Error when streaming a timelapse video', async () => {
        const req = {
            params: {name: 'video.mp4'},
            headers: {range: 'bytes=0-1000'},
            query: {},
        } as unknown as Request;
        const res = {
            writeHead: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        (fs.statSync as jest.Mock).mockImplementation(() => {
            throw new Error('mock error');
        });

        await streamTimelapseEndpoint(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Something went wrong"});
    });
    it('allows for video to be downloaded', async () => {
        const req = {
            params: {name: 'video.mp4'},
            headers: {},
            query: {download: "true"},
        } as unknown as Request;
        const res = {
            writeHead: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
            setHeader: jest.fn(),
        } as unknown as Response;

        (fs.statSync as jest.Mock).mockReturnValue({size: 1001});

        await streamTimelapseEndpoint(req, res);

        expect(res.setHeader).toHaveBeenCalledWith(
            "Content-disposition",
            "attachment; filename=video.mp4"
        );
        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    });
});

describe('getTimelapses', () => {
    it('gets a list of timelapses', async () => {
        const data = [{id: "mock-uuid", name: "video.mp4"}];
        const req = {query: {page: "1", limit: "10"}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findMany.mockResolvedValue([data]);
        (prismaMock.timelapseData as any).count.mockResolvedValue(1);

        await getTimelapses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
    it('Error when getting a list of timelapses', async () => {
        const req = {query: {page: "1", limit: "10"}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findMany.mockRejectedValue(new Error("mock error"));

        await getTimelapses(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Something went wrong"});
    });
    it('gets a list of timelapses with default query parameters', async () => {
        const data = [{id: "mock-uuid", name: "video.mp4"}];
        const req = {query: {}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findMany.mockResolvedValue([data]);
        (prismaMock.timelapseData as any).count.mockResolvedValue(1);

        await getTimelapses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
    it('returns 404 when no timelapses are found', async () => {
        const req = {query: {page: "1", limit: "10"}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findMany.mockResolvedValue([]);

        await getTimelapses(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "No timelapses found"});
    });
});

describe('deleteTimelapse', () => {
    it('deletes a timelapse', async () => {
        const req = {params: {id: "mock-uuid"}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findUnique.mockResolvedValue({id: "mock-uuid", name: "video.mp4"});
        (prismaMock.timelapseData as any).delete.mockResolvedValue({});

        await deleteTimelapse(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Timelapse successfully deleted"});
    });
    it('Error when deleting a timelapse', async () => {
        const req = {params: {id: "mock-uuid"}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findUnique.mockResolvedValue({id: "mock-uuid", name: "video.mp4"});
        (prismaMock.timelapseData as any).delete.mockRejectedValue(new Error("mock error"));

        await deleteTimelapse(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Something went wrong"});
    });
    it('Error when deleting a timelapse that does not exist', async () => {
        const req = {params: {id: "mock-uuid"}} as unknown as Request;
        const res = {status: jest.fn(() => res), json: jest.fn()} as unknown as Response;
        (prismaMock.timelapseData as any).findUnique.mockResolvedValue(null);

        await deleteTimelapse(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Timelapse not found"});
    });
});


describe('createTimelapseEndpoint', () => {
    it('returns 400 when required parameters are missing', async () => {
        const req = {
            body: {from: "", to: "", fps: "", resolution: ""},
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await createTimelapseEndpoint(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Missing parameters"});
    });
    it('returns 404 when no sensor data is found', async () => {
        const req = {
            body: {from: "2021-01-01", to: "2021-01-02", fps: "30", resolution: "720p"},
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        (prisma.sensorData.findMany as jest.Mock).mockResolvedValue([]);

        await createTimelapseEndpoint(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "No data found"});
    });
    it('returns 500 when an error occurs', async () => {
        const req = {
            body: {from: "2021-01-01", to: "2021-01-02", fps: "30", resolution: "720p"},
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        (prisma.sensorData.findMany as jest.Mock).mockRejectedValue(new Error("mock error"));

        await createTimelapseEndpoint(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Something went wrong"});
    });
});