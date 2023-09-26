var jwt = require("jsonwebtoken");
require("dotenv").config();
const Joi = require("joi");
function verifyToken(req, res, next) {
  if (req.headers.authorization == null) {
    res.status(400).json({ success: false, message: "Token is required!" });
  } else {
    var token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(400).json({ success: false, message: "Invalid token!" });
      } else {
        next();
      }
    });
  }
}
function loginMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}
function signUpMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).optional(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.string().required(),
    address: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    gender: Joi.string().required(),
  });

  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}
function emailVerifyMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    otp: Joi.string().min(5).required(),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}
function googleLoginMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).optional(),
    imageUrl: Joi.string(),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}
function sendOtpMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}

function updatePassMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}
function updateFcmMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    fcmToken: Joi.string().required(),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}

module.exports = {
  verifyToken,
  loginMiddleware,
  signUpMiddleware,
  emailVerifyMiddleware,
  googleLoginMiddleware,
  sendOtpMiddleware,
  updatePassMiddleware,
  updateFcmMiddleware,
};
