const express = require("express");
const {
  verifyToken,
  loginMiddleware,
  signUpMiddleware,
  emailVerifyMiddleware,
  googleLoginMiddleware,
  sendOtpMiddleware,
  updatePassMiddleware,
  updateFcmMiddleware,
  forgetPassMiddleware,
} = require("../middlewares/auth_middleware");
const { AuthController } = require("../controllers/auth_controller");

var router = express.Router();

router.post("/login", loginMiddleware, AuthController.login);
router.get("/all", verifyToken, AuthController.getAllUsers);
router.get("/", AuthController.getDataById);
router.post(
  "/update-fcm",
  verifyToken,
  updateFcmMiddleware,
  AuthController.updateFcm
);
router.post("/signUp", signUpMiddleware, AuthController.signUp);
router.post(
  "/verify",
  verifyToken,
  emailVerifyMiddleware,
  AuthController.verifyEmail
);
router.post("/update-profile", verifyToken, AuthController.updateProfile);
router.post(
  "/google-signin",
  googleLoginMiddleware,
  AuthController.googleSignin
);
router.post("/send-otp", sendOtpMiddleware, AuthController.sendOtp);
router.post(
  "/update-password",
  updatePassMiddleware,
  AuthController.updatePassword
);
router.post(
  "/forget-password",
  forgetPassMiddleware,
  AuthController.forgetPassword
);

const AuthRoutes = router;

module.exports = AuthRoutes;
