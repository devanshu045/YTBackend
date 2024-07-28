import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.cloud_Api_key, 
    api_secret: process.env.cloud_Api_secret // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async(localFilePath) =>{
    try{
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(err){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }

}


export {uploadOnCloudinary}