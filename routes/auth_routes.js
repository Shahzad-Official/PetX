const express=require("express");
const { verifyToken, loginMiddleware, signUpMiddleware, emailVerifyMiddleware, googleLoginMiddleware, sendOtpMiddleware, updatePassMiddleware } = require("../middlewares/auth_middleware");
const { AuthController } = require("../controllers/auth_controller");


var router=express.Router();

router.post("/login",loginMiddleware,AuthController.login);
router.post("/signUp",signUpMiddleware,AuthController.signUp);
router.post("/verify",verifyToken,emailVerifyMiddleware,AuthController.verifyEmail);
router.post("/update-profile",verifyToken,AuthController.updateProfile);
router.post("/google-signin",googleLoginMiddleware,AuthController.googleSignin);
router.post("/send-otp",sendOtpMiddleware,AuthController.sendOtp);
router.post("/update-password",updatePassMiddleware,AuthController.updatePassword);

module.exports.authRoutes =router;