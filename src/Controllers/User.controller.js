import { ApiError } from "../Util/ApiError.js";
import { User } from "../Models/User.model.js";
import { ApiResponse } from "../Util/ApiResponse.js";
import { uploadOnCloudinary } from "../Util/Cloudinary.js";
import mongoose from "mongoose";


const genrateAccessAndRefreshToken = async(userid)=>{
     try{ const FindUser = await User.findById(userid);

      const refreshToken = User.genrateRefreshToken();
      const accessToken = User.genrateAccessToken();
      FindUser.refreshToken = refreshToken;
      await User.save({ validateBeforeSave: false })

      return {refreshToken,accessToken};
    }
  catch(error){
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
  }

const registerUser = async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (!fullName || !email || !userName || !password) {
    throw new ApiError(400, "Please enter all details");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: "", // Assuming coverImage is optional and not provided
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
};


const loginUser = async (req, res) => {
  try {
    console.log("Login");

    // Get data from request body
    const { userName, email, password, newword } = req.body;
    console.log(req.body);
    console.log(userName, email, password,newword);

    // Verify data: check if username or email is provided
    if (!userName && !email) {
      return res.status(400).json({ message: 'Please enter username or email' });
    }

    // Find user in the database
    const findUser = await User.findOne({
      $or: [
        { userName: userName },
        { email: email }
      ]
    });

    if (!findUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordCorrect = await findUser.checkPassword(password); // Assuming checkPassword is an instance method

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Generate refresh and access tokens
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(findUser._id);

    // Get user details from database, excluding password and refreshToken
    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken");

    // Set options for cookies
    const options = {
      httpOnly: true,
      secure: true // Ensure secure is used in production with HTTPS
    };

    // Send tokens as cookies and respond with user data
    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        message: 'User logged in successfully',
        user: loggedInUser,
        accessToken,
        refreshToken
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export { registerUser, loginUser };
