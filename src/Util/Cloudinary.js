import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import path from "path";

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Ensure these environment variables are set
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;
console.log(`Cloud Name: ${process.env.CLOUD_NAME}`);
console.log(`API Key: ${process.env.CLOUD_API_KEY}`);
console.log(`API Key2: ${process.env.CLOUD_API_SECRET}`);
console.log(`local file ${localFilePath}`);
try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log(`Uploaded file path: ${localFilePath}`);
        console.log(response);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log(response.url);
        return response.url;
    } catch (err) {
        console.error(`Error uploading to Cloudinary: ${err}`);
        
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if the upload fails
        }
        return null;
    }
};
export { uploadOnCloudinary };
