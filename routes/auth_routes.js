const express=require("express");
const { verifyToken } = require("../middlewares/auth_middleware");
const { AuthController } = require("../controllers/auth_controller");


var router=express.Router();

router.post("/login",AuthController.login);
router.post("/signUp",AuthController.signUp);
router.post("/verify",verifyToken,AuthController.verifyEmail);
router.post("/update",verifyToken,AuthController.updateProfile);
router.post("/google-signin",AuthController.googleSignin);

module.exports.authRoutes =router;