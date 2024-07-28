import multer from "multer";

const storege = multer.diskStorage({
    destination: function(req,file,cb){
            cb(null,"./public/temp"); // store file in local storage
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)   
        console.log(file.originalname)  //cb call back and get file url form local storage
    }
})

export const upload = multer({
    storege: storege
})