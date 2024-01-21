import {Request, Response} from 'express';
import prisma from "../utils/db";
import {getThumbnailById} from "../utils/imageUtils";
import path from "path";
import {randomUUID} from "crypto";
import fs from "fs";
import {
    addGraphVideoToTimelapse,
    createChartImage,
    createGraphVideo,
    createTimelapse,
    deleteTempFiles
} from "../utils/timelapseUtils";

export const streamTimelapseEndpoint = async (req: Request, res: Response) => {
    const videoPath = path.join(__dirname, '../static/timelapses', req.params.name);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const isDownload = req.query.download === 'true';

    if (range && !isDownload) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
            return res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        } else if (start < 0 || end < 0) {
            return res.status(416).send('Requested range not satisfiable\n' + start + ' < 0');
        }

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        console.log("not streaming");
        if (isDownload) {
            console.log("downloading");
            res.setHeader('Content-disposition', 'attachment; filename=' + req.params.name);
        }

        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
};

export const getTimelapses = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        const timelapses = await prisma.timelapseData.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            }
        });
        const totalPages = Math.ceil((await prisma.timelapseData.count()) / limit);
        return res.status(200).json({timelapses: timelapses, totalPages: totalPages});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const deleteTimelapse = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message: 'Missing parameters'});
    }

    try {
        const timelapse = await prisma.timelapseData.findUnique({
            where: {
                id: id
            }
        });
        if (!timelapse) {
            return res.status(404).json({message: 'Timelapse not found'});
        }
        await prisma.timelapseData.delete({
            where: {
                id: id
            }
        });

        const timelapsePath = path.join(__dirname, '../static/timelapses', timelapse.id + '.mp4');
        fs.unlink(timelapsePath, () => {
        });

        return res.status(200).json({message: 'Timelapse successfully deleted'});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const createTimelapseEndpoint = async (req: Request, res: Response) => {
    const {from, to, fps, resolution, createChart} = req.body;
    if (!from || !to || !fps || !resolution) {
        return res.status(400).json({message: 'Missing parameters'});
    }

    try {
        await deleteTempFiles();

        const sensorData = await prisma.sensorData.findMany({
            where: {
                createdAt: {
                    gte: new Date(from as string),
                    lte: new Date(to as string)
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const ids = sensorData.map((data: any) => data.id);
        const id = randomUUID();

        const timelapseFilePath = createChart ? path.join(__dirname, '../static/temp-videos', `${id}_%d.mp4`) : path.join(__dirname, '../static/timelapses', `${id}.mp4`);
        const outputVideoPath = path.join(__dirname, '../static/timelapses', `${id}.mp4`);
        const graphImagesPath = path.join(__dirname, '../static/chart', `${id}_%d.png`);
        const graphVideoPath = path.join(__dirname, '../static/graph-videos', `${id}.mp4`);

        if (createChart) {
            await Promise.all(sensorData.map((data, index) => {
                return createChartImage(sensorData, index, `${id}_${index}`);
            }));
        }

        await createTimelapse(ids, fps as string, resolution as string, id, timelapseFilePath);

        if (createChart) {
            await createGraphVideo(id, fps, graphVideoPath, graphImagesPath);
            await addGraphVideoToTimelapse(graphVideoPath, timelapseFilePath, outputVideoPath);
            await deleteTempFiles();
        }

        const thumbnail = await getThumbnailById(ids[0]);
        await prisma.timelapseData.create({
            data: {
                id: id,
                thumbnail: thumbnail,
            }
        });
        return res.status(200).json("Timelapse successfully created");
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
};
