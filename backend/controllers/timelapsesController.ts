import {Request, Response} from 'express';
import prisma from "../utils/db";
import {getImageById} from "../utils/imageUtils";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export const createTimelapseEndpoint = async (req: Request, res: Response) => {
    const {from, to} = req.query;
    if (!from || !to) {
        return res.status(400).json({message: 'Missing from or to parameter'});
    }

    try {
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
        await createTimelapse(ids);
        return res.status(200).json("Timelapse successfully created");
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
};
const createTimelapse = async (ids: string[]) => {
    const imagePaths = (await Promise.all(ids.map(id => getImageById(id))))
        .map(name => path.join('./static/images', name));

    const fileListPath = path.join('./', 'imageList.txt');
    const fileListStream = fs.createWriteStream(fileListPath);

    imagePaths.forEach(imagePath => fileListStream.write(`file '${imagePath}' duration 0.5\n`));
    fileListStream.end();

    const timelapseFileName = `timelapse-${Date.now()}.mp4`;
    const timelapseFilePath = path.join('./static/timelapses', timelapseFileName);

    return new Promise((resolve, reject) => {
        ffmpeg(fileListPath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions(['-c copy'])
            .on('end', () => {
                fs.unlink(fileListPath, () => {
                    resolve(timelapseFileName);
                });
            })
            .on('error', (error) => {
                reject(error);
            })
            .save(timelapseFilePath);
    });
};