import multer from 'multer';

const ORIGINAL_IMG_PATH = './static/images';
const THUMBNAIL_IMG_PATH = './static/thumbnails';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, ORIGINAL_IMG_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }).single('image');

export default upload;