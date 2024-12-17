
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});


// Multiple image upload configuration
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

// Single image upload configuration
const uploadSingleImage = multer({ 
    storage: storage 
});

export { uploadSingleImage };


export default upload;