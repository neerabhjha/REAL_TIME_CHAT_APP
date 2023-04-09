const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const cloudinary = require("cloudinary").v2;
const cloudinary = require('../cloudinary')

//user Signup

const signupController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.send({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.send({
        message: "User already exists",
        success: false,
      });
    }
    //create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.send({
      message: "User created successfully",
      success: true,
    });
  } catch (e) {
    res.send({
      message: e.message,
      success: false,
    });
  }
};

//user Login

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "User doesn't exists",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });

    return res.send({
      success: true,
      message: "Login successful",
      data: accessToken,
    });
  } catch (e) {
    return res.send({
      message: e.message,
      success: false,
    });
  }
};

//get current user
const getCurUserController = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (e) {
    return res.send({
      success: false,
      message: e.message,
    });
  }
};

//get all users except current user
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req._id } });
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

//update profile pic
const updateProfilePictureController = async (req, res) => {
  try {
    const image = req.body.image;

    //upload image to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "chat-app",
    });

    //update user profile pic in db
    const user = await User.findOneAndUpdate(
      { _id: req._id },
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    return res.send({
      success: true,
      message: "Profile picture updated successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error,
    });
  }
};

//internal functions to generate access and refresh token
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    return res.send({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  loginController,
  signupController,
  getCurUserController,
  getAllUsers,
  updateProfilePictureController,
};
