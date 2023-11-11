import fs from "fs/promises"
import path from "path";

const staticPath = path.join(__dirname, '..', 'static');

const checkAndCleanStorage = async () => {
    const imagesPath = path.join(staticPath, 'images');
    const thumbnailsPath = path.join(staticPath, 'thumbnails');
    const sizeLimit = 0.5 * 1024 * 1024;

    const imagesSize = await getDirectorySize(imagesPath);
    const thumbnailsSize = await getDirectorySize(thumbnailsPath);
    const totalSize = imagesSize + thumbnailsSize;

    console.log(totalSize);
    if (totalSize > sizeLimit) {
        console.log('Cleaning storage');
        await cleanOldFiles(imagesPath);
        await cleanOldFiles(thumbnailsPath);
    }
};

const getDirectorySize = async (dirPath: string) => {
    const files = await fs.readdir(dirPath);
    let totalSize = 0;

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
    }

    return totalSize;
};
const cleanOldFiles = async (imagesPath: string) => {
    const files = await fs.readdir(imagesPath);
    const filesWithStats = await Promise.all(files.map(async (file) => {
        const filePath = path.join(imagesPath, file);
        const stats = await fs.stat(filePath);
        return {filePath, stats};
    }));
    filesWithStats.sort((a, b) => a.stats.mtimeMs - b.stats.mtimeMs);
    const filesToDelete = filesWithStats.slice(0, filesWithStats.length / 2);
    await Promise.all(filesToDelete.map(async (file) => {
        await fs.unlink(file.filePath);
    }));
}

export default checkAndCleanStorage;