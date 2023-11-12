import fs from "fs/promises"
import path from "path";
import {extractSensorIdFromFileName} from "./imageUtils";
import prisma from "./db";

const staticPath = path.join(__dirname, '..', 'static');
const sizeLimit = 1024 * 1024 * 1024; // 1GB

const checkAndCleanStorage = async () => {
    try {
        const imagesPath = path.join(staticPath, 'images');
        const thumbnailsPath = path.join(staticPath, 'thumbnails');
        const imagesSize = await getDirectorySize(imagesPath);
        const thumbnailsSize = await getDirectorySize(thumbnailsPath);
        const totalSize = imagesSize + thumbnailsSize;

        const deletedSensorIds = new Set<string>();

        if (totalSize > sizeLimit) {
            await cleanOldFiles(imagesPath, deletedSensorIds);
            await cleanOldFiles(thumbnailsPath, deletedSensorIds);
        }

        if (deletedSensorIds.size > 0) {
            await prisma.sensorData.deleteMany({
                where: {
                    id: {
                        in: Array.from(deletedSensorIds)
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const getDirectorySize = async (dirPath: string) => {
    try {
        const files = await fs.readdir(dirPath);
        let totalSize = 0;

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;
        }

        return totalSize;
    } catch (error) {
        console.log(error);
        return 0;
    }
};


const cleanOldFiles = async (dirPath: string, deletedSensorIds: Set<string>) => {
    try {
        const files = await fs.readdir(dirPath);
        const filesWithStats = await Promise.all(files.map(async (file) => {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            return {file, stats};
        }));

        const sortedFiles = filesWithStats.sort((a, b) => a.stats.mtimeMs - b.stats.mtimeMs);
        const filesToDelete = sortedFiles.slice(0, sortedFiles.length / 2);

        for (const file of filesToDelete) {
            const filePath = path.join(dirPath, file.file);
            await fs.unlink(filePath);

            const sensorId = extractSensorIdFromFileName(filePath);
            if (sensorId) {
                deletedSensorIds.add(sensorId);
            }
        }
    } catch (error) {
        console.error('Error during file cleaning:', error);
    }
};


export default checkAndCleanStorage;