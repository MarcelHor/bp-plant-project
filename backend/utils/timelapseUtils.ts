import fs from "fs";
import {getImageById} from "./imageUtils";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import {ChartConfiguration} from "chart.js";
import {ChartJSNodeCanvas} from "chartjs-node-canvas";
import {createCanvas} from "canvas";

const width = 800;
const height = 400;
const backgroundColour = "#ffffff";
const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour,
});

export const createTimelapse = async (ids: string[], fps: string, resolution: string, id: string, outputPath: string, sensorData: any[]): Promise<string> => {
    try {
        const imagePaths = (
            await Promise.all(ids.map((id) => getImageById(id)))
        ).map((name) => path.join("./static/images", name).replace(/\\/g, "/"));

        const fileListPath = path.join("./", "imageList.txt").replace(/\\/g, "/");
        const fileListStream = fs.createWriteStream(fileListPath);

        imagePaths.forEach((imagePath) => {
            fileListStream.write(`file '${imagePath}'\n`);
        });
        fileListStream.end();

        return new Promise((resolve, reject) => {
            fileListStream.on("finish", () => {
                ffmpeg(fileListPath)
                    .inputOptions(["-f concat", "-safe 0"])
                    .inputFPS(parseFloat(fps))
                    .outputOptions([
                        "-c:v libx264",
                        "-r " + fps,
                        "-pix_fmt yuv420p",
                        "-s " + resolution,
                    ])
                    .size(resolution)
                    .on("end", () => {
                        fs.unlink(fileListPath, () => {
                            resolve(outputPath);
                        });
                    })
                    .on("error", (error) => {
                        fs.unlink(fileListPath, () => {
                            reject(error);
                        });
                    })
                    .save(outputPath);
            });
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createChartImage = async (allData: any[], currentIndex: number, imageName: string, chartImagesPath: string) => {
    if (!Array.isArray(allData) || allData.length === 0) {
        throw new Error("Invalid data provided for chart creation.");
    }

    const filteredData = allData.slice(0, currentIndex + 1);
    const labels = filteredData.map((data) => data.createdAt);
    const temperature = filteredData.map((data) => data.temperature);
    const humidity = filteredData.map((data) => data.humidity);
    const soilMoisture = filteredData.map((data) => data.soilMoisture);
    const light = filteredData.map((data) => data.light);

    const configuration: ChartConfiguration = {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperature",
                    data: temperature,
                    fill: false,
                    borderColor: "rgb(234,165,0)",
                },
                {
                    label: "Humidity",
                    data: humidity,
                    fill: false,
                    borderColor: "rgb(79,159,240)",
                },
                {
                    label: "Soil Moisture",
                    data: soilMoisture,
                    fill: false,
                    borderColor: "rgb(0,126,0)",
                },
                {
                    label: "Light",
                    data: light,
                    fill: false,
                    borderColor: "rgb(255,255,0)",
                },
            ],
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    display: true,
                },
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Time",
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const chartPath = path.join(chartImagesPath, `${imageName}.png`);
    fs.writeFileSync(chartPath, image);
};

export const generateDateImage = async (date: string): Promise<Buffer> => {
    const width = 300;
    const height = 100;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(255,255,255,0)";
    context.fillRect(0, 0, width, height);

    context.font = "32px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#ffffff";

    context.fillText(date, width / 2, height / 2);
    return canvas.toBuffer();
};

export const createOverlayVideo = async (id: string, fps: string, imagesPath: string, videoPath: string) => {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(imagesPath)
            .inputFPS(parseFloat(fps))
            .outputOptions(["-c:v libx264", "-r " + fps, "-pix_fmt rgba"])
            .on("end", () => resolve(videoPath))
            .on("error", (error) => reject(error))
            .save(videoPath);
    });
};

export const addGraphOverlayToTimelapse = async (timelapseVideoPath: string, graphOverlayVideoPath: string, outputVideoPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(timelapseVideoPath)
            .input(graphOverlayVideoPath)
            .complexFilter([
                "[0:v][1:v] overlay=10:10"
            ])
            .outputOptions(["-c:v libx264", "-pix_fmt rgba"])
            .on("end", () => resolve(outputVideoPath))
            .on("error", (error) => reject(error))
            .save(outputVideoPath);
    });
};

export const addDateOverlayToTimelapse = async (timelapseVideoPath: string, dateOverlayVideoPath: string, outputVideoPath: string): Promise<string> => {

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(timelapseVideoPath)
            .input(dateOverlayVideoPath)
            .complexFilter([
                "[0:v][1:v] overlay=main_w-overlay_w-10:10"
            ])
            .outputOptions(["-c:v libx264", "-pix_fmt rgba"])
            .on("end", () => resolve(outputVideoPath))
            .on("error", (error) => reject(error))
            .save(outputVideoPath);
    });
};


export const deleteTempDirs = async (Paths: string[]) => {
    try {
        for (const tempPath of Paths) {
            fs.rmSync(tempPath, {recursive: true});
        }
    } catch
        (error: any) {
        throw error;
    }
};

export const formatDateTimeString = (date: string): string => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${formattedDay}.${formattedMonth}.${year}`;
};
