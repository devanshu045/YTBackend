import { ApiError } from "../Util/ApiError.js";
import { User } from "../Models/User.model.js";
import { ApiResponse } from "../Util/Apiresponse.js";
import { uploadOnCloudinary } from "../Util/Cloudinary.js";
import mongoose from "mongoose";

const registerUser = async (req,res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;

  if (fullName == "" || email == "" || username == "" || password == "") {
    throw new ApiError(400, "Please Enter Details");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath)
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!avatar) {
    throw new ApiError(400, "Avatar Url is required");
  }
//  if(!coverImage) {
//    coverImage = ""
// //  }
  const user = User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  }); 

  const createdUser = User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
};

export { registerUser };
