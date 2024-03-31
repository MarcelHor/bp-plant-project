import * as imageUtils from '../utils/imageUtils';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as jimp from 'jimp';

jest.mock('fs/promises');
jest.mock('path');
jest.mock('jimp');

describe('createThumbnail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (path.join as any).mockReturnValue("/mocked/path/to/thumbnail-test.jpg");
    });

    it('should create a thumbnail if it does not already exist', async () => {
        const mockFile = { buffer: Buffer.from('fake image data') };
        const fileName = 'test.jpg';

        (fs.access as any).mockRejectedValue(new Error('File does not exist'));

        const mockedJimpInstance = {
            resize: jest.fn().mockReturnThis(),
            quality: jest.fn().mockReturnThis(),
            writeAsync: jest.fn().mockResolvedValue(undefined),
        };
        (jimp.read as any).mockResolvedValue(mockedJimpInstance)

        await imageUtils.createThumbnail(mockFile, fileName);

        expect(jimp.read).toHaveBeenCalledWith(mockFile.buffer);
        expect(mockedJimpInstance.writeAsync).toHaveBeenCalledWith("/mocked/path/to/thumbnail-test.jpg");
    });

    it('should throw an error if the thumbnail already exists', async () => {
        const mockFile = { buffer: Buffer.from('fake image data') };
        const fileName = 'test.jpg';

        (fs.access as any).mockResolvedValue(undefined);

        await expect(imageUtils.createThumbnail(mockFile, fileName))
            .rejects
            .toThrow('Thumbnail already exists');
    });
});

describe('saveImage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (path.join as any).mockReturnValue("/mocked/path/to/image-test.jpg");
    });

    it('should save an image if it does not already exist', async () => {
        const mockFile = { buffer: Buffer.from('fake image data') };
        const fileName = 'test.jpg';

        (fs.access as any).mockRejectedValue(new Error('File does not exist'));

        await imageUtils.saveImage(mockFile, fileName);

        expect(fs.writeFile).toHaveBeenCalledWith("/mocked/path/to/image-test.jpg", mockFile.buffer);
    });

    it('should throw an error if the image already exists', async () => {
        const mockFile = { buffer: Buffer.from('fake image data') };
        const fileName = 'test.jpg';

        (fs.access as any).mockResolvedValue(undefined);

        await expect(imageUtils.saveImage(mockFile, fileName))
            .rejects
            .toThrow('Image already exists');
    });
});

describe('getImageById', () => {
    it('should return image file name if image exists', async () => {
        const id = '123e4567-e89b-12d3-a456-426614174000';
        const mockImageFileName = `image-${id}.jpg`;
        (fs.readdir as jest.Mock).mockResolvedValue([mockImageFileName]);
        (fs.access as jest.Mock).mockResolvedValue(undefined);

        const result = await imageUtils.getImageById(id);

        expect(result).toEqual(mockImageFileName);
    });

    it('should throw an error if image does not exist', async () => {
        const id = 'nonexistent-id';
        (fs.readdir as jest.Mock).mockResolvedValue([]);

        await expect(imageUtils.getImageById(id)).rejects.toThrow('Image not found');
    });
});

describe('getThumbnailById', () => {
    it('should return thumbnail file name if thumbnail exists', async () => {
        const id = '123e4567-e89b-12d3-a456-426614174000';
        const mockThumbnailFileName = `thumbnail-${id}.jpg`;
        (fs.readdir as jest.Mock).mockResolvedValue([mockThumbnailFileName]);
        (fs.access as jest.Mock).mockResolvedValue(undefined);

        const result = await imageUtils.getThumbnailById(id);

        expect(result).toEqual(mockThumbnailFileName);
    });

    it('should throw an error if thumbnail does not exist', async () => {
        const id = 'nonexistent-id';
        (fs.readdir as jest.Mock).mockResolvedValue([]);

        await expect(imageUtils.getThumbnailById(id)).rejects.toThrow('Thumbnail not found');
    });
});
