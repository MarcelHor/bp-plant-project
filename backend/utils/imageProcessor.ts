import sharp from 'sharp';

export const processImage = async (inputPath: string, outputPath: string) => {
    await sharp(inputPath)
        .resize(200, 200, {fit: 'inside'})
        .toFile(outputPath);
};
