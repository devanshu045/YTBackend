import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchea = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trime:true,
    index:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    trim: true, 
},
fullName: {
    type: String,
    required: true,
    trim: true, 
    index: true
},
avatar: {
    type: String, // cloudinary url
    // required: true,
},
coverImage: {
    type: String, // cloudinary url
},

watchVideo: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Video"
},
password: {
    type: String,
    required: [true, 'Password is required']
},
refreshToken: {
    type: String
}
},{ timestamps: true});

UserSchea.pre('save',async function(){
         if(!this.isModified("password")) return next;
         this.password = bcrypt.hash(this.password,10);
         next();
})

UserSchea.method.isPasswordCorrect = async function(password){
 return await bcrypt.compare(this.password,password);
}


export const User = mongoose.model('User',UserSchea)