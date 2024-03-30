import {Request, Response} from "express";
import prisma from "../utils/db";
import {getThumbnailById} from "../utils/imageUtils";
import path from "path";
import {randomUUID} from "crypto";
import fs from "fs";
import {
    addDateOverlayToTimelapse,
    addGraphOverlayToTimelapse,
    createChartImage, createOverlayVideo,
    createTimelapse,
    deleteTempDirs,
    formatDateTimeString,
    generateDateImage,
} from "../utils/timelapseUtils";

export const streamTimelapseEndpoint = async (req: Request, res: Response) => {
    try {
        const videoPath = path.join('./', "static/timelapses", req.params.name);
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        const isDownload = req.query.download === "true";

        if (range && !isDownload) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize || end >= fileSize) {
                return res
                    .status(416)
                    .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
            } else if (start < 0 || end < 0) {
                return res
                    .status(416)
                    .send("Requested range not satisfiable\n" + start + " < 0");
            }

            const chunksize = end - start + 1;
            const file = fs.createReadStream(videoPath, {start, end});
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            if (isDownload) {
                res.setHeader(
                    "Content-disposition",
                    "attachment; filename=" + req.params.name
                );
            }

            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
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
                createdAt: "desc",
            },
        });
        if (timelapses.length === 0) {
            return res.status(404).json({message: "No timelapses found"});
        }
        const totalPages = Math.ceil((await prisma.timelapseData.count()) / limit);
        return res
            .status(200)
            .json({timelapses: timelapses, totalPages: totalPages});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const deleteTimelapse = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id);
    if (!id) {
        return res.status(400).json({message: "Missing parameters"});
    }

    try {
        const timelapse = await prisma.timelapseData.findUnique({
            where: {
                id: id,
            },
        });

        if (!timelapse) {
            return res.status(404).json({message: "Timelapse not found"});
        }

        console.log(timelapse);
        await prisma.timelapseData.delete({
            where: {
                id: id,
            },
        });

        const timelapsePath = path.join('./', "static/timelapses", timelapse.id + ".mp4");
        fs.unlink(timelapsePath, () => {
        });

        return res.status(200).json({message: "Timelapse successfully deleted"});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const createTimelapseEndpoint = async (req: Request, res: Response) => {
    const {from, to, fps, resolution, createChart, dateOverlay} = req.body;
    if (!from || !to || !fps || !resolution) {
        return res.status(400).json({message: "Missing parameters"});
    }

    let tempFiles: string[] = [];

    try {
        const sensorData = await prisma.sensorData.findMany({
            where: {
                createdAt: {
                    gte: new Date(from as string),
                    lte: new Date(to as string),
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        if (sensorData.length === 0) {
            return res.status(404).json({message: "No data found"});
        }

        const ids = sensorData.map((data: any) => data.id);
        const processId = randomUUID();
        const id = randomUUID();


        const outputVideoPath: string = path.join('./', 'static', 'timelapses', `${id}.mp4`);
        const chartImagesPath: string = path.join('./', 'static', 'chart-images', processId);
        const chartVideoPath: string = path.join('./', 'static', 'chart-videos', processId, `${id}.mp4`);
        const dateImagesPath: string = path.join('./', 'static', 'date-images', processId);
        const dateVideoPath: string = path.join('./', 'static', 'date-videos', processId, `${id}.mp4`);
        const tempVideoPath = path.join('./', 'static', 'temp-videos', processId, `${id}_temp.mp4`);
        const overlayTempVideoPathChart = path.join('./', 'static', 'temp-videos', processId, `${id}_overlay_temp_chart.mp4`)
        const overlayTempVideoPathDate = path.join('./', 'static', 'temp-videos', processId, `${id}_overlay_temp_date.mp4`);

        fs.mkdirSync(path.join('./', 'static', 'chart-images', processId), {recursive: true});
        fs.mkdirSync(path.join('./', 'static', 'date-images', processId), {recursive: true});
        fs.mkdirSync(path.join('./', 'static', 'chart-videos', processId), {recursive: true});
        fs.mkdirSync(path.join('./', 'static', 'date-videos', processId), {recursive: true});
        fs.mkdirSync(path.join('./', 'static', 'temp-videos', processId), {recursive: true});

        let finalVideoPath: string = tempVideoPath;

        tempFiles = [
            path.join('./', `static/temp-videos/${processId}/`),
            path.join('./', `static/chart-images/${processId}/`),
            path.join('./', `static/date-images/${processId}/`),
            path.join('./', `static/chart-videos/${processId}/`),
            path.join('./', `static/date-videos/${processId}/`),
        ];

        await createTimelapse(
            ids,
            fps as string,
            resolution as string,
            id,
            finalVideoPath,
            sensorData
        );

        if (createChart) {
            await Promise.all(
                sensorData.map((data, index) => {
                    return createChartImage(sensorData, index, `${id}_${index}`, chartImagesPath);
                })
            );

            const chartImagesPattern = path.join(chartImagesPath, `${id}_%d.png`);
            await createOverlayVideo(id, fps, chartImagesPattern, chartVideoPath);

            finalVideoPath = await addGraphOverlayToTimelapse(finalVideoPath, chartVideoPath, overlayTempVideoPathChart);
        }

        if (dateOverlay) {
            const dates: string[] = sensorData.map((data) =>
                formatDateTimeString(data.createdAt.toString())
            );

            for (const [index, date] of dates.entries()) {
                const dateImage = await generateDateImage(date);
                const dateImageName = `${id}_${index}.png`;
                const dateImagePath = path.join(dateImagesPath, dateImageName);
                fs.writeFileSync(dateImagePath, dateImage);
            }

            const dateImagesPattern = path.join(dateImagesPath, `${id}_%d.png`);
            await createOverlayVideo(id, fps, dateImagesPattern, dateVideoPath);


            finalVideoPath = await addDateOverlayToTimelapse(finalVideoPath, dateVideoPath, overlayTempVideoPathDate);
        }

        if (finalVideoPath !== outputVideoPath) {
            fs.renameSync(finalVideoPath, outputVideoPath);
        }

        const thumbnail = await getThumbnailById(ids[0]);
        await prisma.timelapseData.create({
            data: {
                id: id,
                thumbnail: thumbnail,
            },
        });

        await deleteTempDirs(tempFiles);

        return res.status(200).json("Timelapse successfully created");
    } catch (error: any) {
        console.log(error);
        await deleteTempDirs(tempFiles);
        return res.status(500).json({message: "Something went wrong"});
    }
};
