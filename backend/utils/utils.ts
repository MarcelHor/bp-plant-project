import path from 'path';
import fs from "fs";

export function checkStaticFolder() {
    const staticPath = path.join('./', 'static');
    if (!fs.existsSync(staticPath)) {
        fs.mkdirSync(staticPath);
    }

    const subFolders = ['images', 'thumbnails', 'timelapses', 'chart-images', 'date-images', 'chart-videos', 'date-videos', 'temp-videos'];
    subFolders.forEach((folder: string) => {
        const folderPath = path.join(staticPath, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    });
}