import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert file URL to path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory exists
const tempDir = path.join(__dirname, "../public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir); // Store file in local storage
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Set the file name
        console.log(file.originalname); // Log the file name
    }
});

export const upload = multer({
    storage: storage
});
