import jimp from 'jimp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Create thumbnail from image
 * @throws Error if thumbnail already exists
 * @returns void
 * @param file image file
 * @param fileName desired file name
 */
export async function createThumbnail(file: any, fileName: string) {
    const thumbnailPath = path.join('./static/thumbnails', `thumbnail-${fileName}`);
    try {
        await fs.access(thumbnailPath);
        throw new Error('Thumbnail already exists');
    } catch (error: any) {
        if (error.message.includes('Thumbnail already exists')) {
            throw error;
        }
        const image = await jimp.read(file.buffer);
        await image.resize(200, jimp.AUTO)
            .quality(90)
            .writeAsync(thumbnailPath);
    }
}

/**
 * Save image to static/images folder
 * @param file image file
 * @param fileName desired file name
 * @throws Error if image already exists
 * @returns void
 */
export async function saveImage(file: any, fileName: string) {
    const imagePath = path.join('./static/images', `image-${fileName}`);
    try {
        await fs.access(imagePath);
        throw new Error('Image already exists');
    } catch (error: any) {
        if (error.message.includes('Image already exists')) {
            throw error;
        }
        await fs.writeFile(imagePath, file.buffer);
    }
}

export const extractSensorIdFromFileName = (filePath: string) => {
    const fileName = path.basename(filePath);
    const match = fileName.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/);
    return match ? match[1] : null;
};


/**
 * Get image by id
 * @returns full image file name
 * @param id
 * @throws Error if image not found or is not accessible
 */
export const getImageById = async (id: string) => {
    try {
        const files = await fs.readdir('./static/images');
        const imageFileName = files.find(file => file.includes(id));
        if (!imageFileName) {
            throw new Error('Image not found');
        }
        const imagePath = path.join('./static/images', imageFileName);
        await fs.access(imagePath);
        return imageFileName;
    } catch (error: any) {
        if (error.message.includes('no such file or directory')) {
            throw new Error('Image not found');
        }
        throw error;
    }
}

/**
 * Get thumbnail by id
 * @returns full thumbnail file name
 * @param id
 * @throws Error if thumbnail not found or is not accessible
 */
export const getThumbnailById = async (id: string) => {
    try {
        const files = await fs.readdir('./static/thumbnails');
        const thumbnailFileName = files.find(file => file.includes(id));
        if (!thumbnailFileName) {
            throw new Error('Thumbnail not found');
        }
        const thumbnailPath = path.join('./static/thumbnails', thumbnailFileName);
        await fs.access(thumbnailPath);
        return thumbnailFileName;
    } catch (error: any) {
        if (error.message.includes('no such file or directory')) {
            throw new Error('Thumbnail not found');
        }
        throw error;
    }
}