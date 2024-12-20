import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "./../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplet.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordtemplet.js";
import { response } from "express";
import jwt from "jsonwebtoken";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Prodive Name, Email,Password ",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "This email is already registered",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    console.log(hashPassword);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Email from Binkeyit",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return res.json({
      message: "User Register Successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Verify Email Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!email || !password) {
      return res.json({
        message: "Please provide Email and password",
      });
    }
    if (!user) {
      return res.status(400).json({
        message: "This email is not registerd",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message: "User not Active",
        error: true,
        success: false,
      });
    }

    const checkPasword = await bcryptjs.compare(password, user.password);
    if (!checkPasword) {
      return res.status(400).json({
        message: "Credentials do not match. Please check and try again.",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
      last_login_date:new Date()
    }) 

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOptions);
    res.cookie("refreshToken", refreshToken, cookiesOptions);

    return res.json({
      message: "Login Successfully ",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// logout Controller
export const logoutController = async (req, res) => {
  try {
    const userid = req.userId; //come from middleware
    console.log(userid);

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOptions);
    res.clearCookie("refreshToken", cookiesOptions);

    const removeRefrushToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// upload user avatar

export const uploadUserAvatar = async (req, res) => {
  try {
    const userId = req.userId; // come fromauth middleware
    const image = req.file; //come from multer middleware
    console.log("image", image);
    const upload = await uploadImageCloudinary(image);

    const updateUserAvatar = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload?.url,
    });

    return res.json({
      message: "Upload profile",
      success:true,
      error:false,
      data: {
        _id: userId,
        avatar: upload?.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, mobile, password } = req.body;
    let hashPassword;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );

    return res.json({
      message: "User Data Update successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || message,
      error: true,
      success: true,
    });
  }
};

//forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "This email is not register",
        error: true,
        success: false,
      });
    }
    const otp = generatedOtp();

    const expireTime = new Date() + 60 * 60 * 1000;

    const update = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: otp,
      forget_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Binkeyit",
      html: forgotPasswordTemplate({
        name: user?.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "Check Your Email",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// verify forgot password

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      res.json({
        message: "Provide Email or OTP",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "User didn't find",
        error: true,
        success: false,
      });
    }
    const currentTime = new Date().toISOString();

    if (user.forget_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP was expired",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid Otp",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
      forgot_password_otp:"",
      forget_password_expiry:""
    })
    //if otp is not expire
    // otp === user. fotgort_password_otp

    return res.json({
      message: "verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//reset the password

export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.json({
        message: "Provide Email, newPassword and confirm password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "doesn't match new passsword and confirm password",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const updatePassword = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });

    return res.json({
      message: "Password reset successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const refrestToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        message: "unauthorizer Access",
        error: true,
        success: false,
      });
    }

    console.log("refreshToken", refreshToken);

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_TOKEN
    );
    if (!verifyToken) {
      return res.status(401).json({
        message: "Expaire Token",
        error: true,
        success: false,
      });
    }

    const userID = verifyToken?._id;

    console.log("verifyToken", verifyToken);
    const newAccessToken = await generatedAccessToken(userID);
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", newAccessToken, cookiesOptions);

    return res.json({
      message: "New Access token generated Successfully",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const userDetails = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    
    const user = await UserModel.findById(userId).select("-password -refresh_token  ")

    if(!user){
      return res.status(400).json({
        message:"Can not Found User",
        error :true,
        success:false
      })
    }

    return res.json({
      message: "User Details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error :true,
      success:false
    })
  }
};
