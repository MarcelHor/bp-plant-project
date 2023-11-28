import {Request, Response} from 'express';
import prisma from "../utils/db";
import {getImageById} from "../utils/imageUtils";
import path from "path";
import {exec} from "child_process";


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
        const timelapseFile = await createTimelapse(ids);


        return res.status(200).json("Timelapse successfully created");

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
};

const createTimelapse = async (ids: string[]) => {
    const imagePaths = (await Promise.all(ids.map(id => getImageById(id))))
        .map(name => `./static/images/${name}`); // Upravte cestu podle vašeho nastavení

    const timelapseFileName = `timelapse-${Date.now()}.mp4`;
    const timelapseFilePath = path.join('./static/timelapses', timelapseFileName);

    const ffmpegCommand = `ffmpeg -y -framerate 24 -pattern_type glob -i './static/images/*.jpeg' -c:v libx264 -pix_fmt yuv420p ${timelapseFilePath}`;

    return new Promise((resolve, reject) => {
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject('Failed to create timelapse');
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return reject('Failed to create timelapse');
            }
            resolve(timelapseFilePath);
        });
    });
};
