import fs from "fs";
import {getImageById} from "./imageUtils";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import {ChartConfiguration} from "chart.js";
import {ChartJSNodeCanvas} from 'chartjs-node-canvas';

const width = 800;
const height = 400;
const backgroundColour = '#ffffff';
const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height, backgroundColour});

export const createTimelapse = async (ids: string[], fps: string, resolution: string, id: string, outputPath: string) => {
    let fileListStream: fs.WriteStream;

    try {
        const imagePaths = (await Promise.all(ids.map(id => getImageById(id))))
            .map(name => path.join('./static/images', name));

        const fileListPath = path.join('./', 'imageList.txt');
        fileListStream = fs.createWriteStream(fileListPath);

        imagePaths.forEach(imagePath => {
            fileListStream.write(`file '${imagePath}'\n`);
            fileListStream.write(`duration ${1 / parseFloat(fps)}\n`);
        });
        fileListStream.end();

        return new Promise((resolve, reject) => {
            ffmpeg(fileListPath)
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions(['-r ' + fps, '-s ' + resolution])
                .on('end', () => {
                    fs.unlink(fileListPath, () => {
                        resolve(outputPath);
                    });
                })
                .on('error', (error) => {
                    reject(error);
                })
                .save(outputPath);
        });
    } catch (error: any) {
        return Promise.reject(error);
    }
};

export const createChartImage = async (allData: any[], currentIndex: number, imageName: string) => {
    if (!Array.isArray(allData) || allData.length === 0) {
        throw new Error('Invalid data provided for chart creation.');
    }

    const filteredData = allData.slice(0, currentIndex + 1);
    const labels = filteredData.map(data => data.createdAt);
    const temperature = filteredData.map(data => data.temperature);
    const humidity = filteredData.map(data => data.humidity);
    const soilMoisture = filteredData.map(data => data.soilMoisture);
    const light = filteredData.map(data => data.light);

    const configuration: ChartConfiguration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature',
                    data: temperature,
                    fill: false,
                    borderColor: 'rgb(234,165,0)',
                },
                {
                    label: 'Humidity',
                    data: humidity,
                    fill: false,
                    borderColor: 'rgb(79,159,240)',
                },
                {
                    label: 'Soil Moisture',
                    data: soilMoisture,
                    fill: false,
                    borderColor: 'rgb(0,126,0)',
                },
                {
                    label: 'Light',
                    data: light,
                    fill: false,
                    borderColor: 'rgb(255,255,0)',
                }
            ]
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
                        text: 'Time'
                    },
                    ticks: {
                        display: false,
                    }
                }
            },
        }
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const chartPath = path.join(__dirname, '../static/chart', imageName + '.png');
    fs.writeFileSync(chartPath, image);
}

export const createGraphVideo = async (id: string, fps: string, graphVideoPath: string, graphImagesPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(graphImagesPath)
            .inputFPS(parseFloat(fps))
            .outputOptions(['-c:v libx264', '-r ' + fps, '-pix_fmt yuv420p'])
            .on('end', () => resolve(graphVideoPath))
            .on('error', (error) => reject(error))
            .save(graphVideoPath);
    });
};

export const addGraphVideoToTimelapse = async (graphVideoPath: string, timelapseVideoPath: string, outputVideoPath: string) => {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(timelapseVideoPath)
            .input(graphVideoPath)
            .complexFilter([
                '[0:v][1:v] overlay=10:10' // Přidání grafického videa do levého rohu
            ])
            .outputOptions(['-c:v libx264', '-pix_fmt yuv420p'])
            .on('end', () => resolve(outputVideoPath))
            .on('error', (error) => reject(error))
            .save(outputVideoPath);
    });
};

const deleteFilesInDirectory = async (directoryPath: string) => {
    const files = await fs.promises.readdir(directoryPath);
    for (const file of files) {
        await fs.promises.unlink(path.join(directoryPath, file));
    }
};

export const deleteTempFiles = async () => {
    try {
        await deleteFilesInDirectory(path.join(__dirname, '../static/chart'));
        await deleteFilesInDirectory(path.join(__dirname, '../static/temp-videos'));
        await deleteFilesInDirectory(path.join(__dirname, '../static/graph-videos'));
    } catch (error: any) {
        throw error;
    }
};

