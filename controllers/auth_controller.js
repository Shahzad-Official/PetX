const User = require("../models/user_model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrupt = require("bcrypt");
const fs = require("fs");
const {
  base64_decode,
  sendEmail,
  downloadAndSaveImage,
  generateShortCode,
} = require("../utils/app_functions");
const otpGenerator = require("otp-generator");
const otpStorage = new Map();

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    await User.findOne({
      email: email,
    })
      .then(async (doc) => {
        if (!doc) {
          res.status(404).json({
            success: false,
            message: "User not found with this email!",
          });
        } else {
          await bcrupt
            .compare(password, doc.password)
            .then((result) => {
              if (!result) {
                res.status(400).json({
                  success: false,
                  message: "Please check your password!",
                });
              } else {
                var token = jwt.sign(
                  JSON.stringify(doc),
                  process.env.JWT_SECRET
                );
                if (doc.isVerified) {
                  res.json({
                    success: true,
                    message: "User LoggedIn Successfully!",
                    data: doc,
                    token: token,
                  });
                } else {
                  res.status(401).json({
                    success: false,
                    message:
                      "You account is not verified yet. Please verify it first.",
                  });
                }
              }
            })
            .catch((err) => {
              res.status(500).json({ success: false, message: err });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: err });
      });
  }
  static async signUp(req, res) {
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      profile,
      referrer,
      address,
      latitude,
      longitude,
      gender,
    } = req.body;

    var path = base64_decode(profile, "profile", "profile", "png");

    User.findOne({
      email: email,
    })
      .then(async (doc) => {
        if (doc) {
          fs.rmSync(path);
          res
            .status(400)
            .json({ success: false, message: "Email is already registered!" });
        } else {
          var newPath = path.split("public/")[1];
          await bcrupt
            .hash(password, 10)
            .then(async (pass) => {
              var user = User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                mobile: mobile,
                password: pass,
                profile: newPath,
                referralCode: generateShortCode(referrer),
                referrer: referrer,
                location: {
                  address: address,
                  latitude: latitude,
                  longitude: longitude,
                },
                gender: gender,
              });

              await user
                .save()
                .then(async (data) => {
                  const otp = otpGenerator.generate(5, {
                    digits: true,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                    upperCaseAlphabets: false,
                  });

                  await sendEmail(email, otp);
                  var token = jwt.sign(
                    JSON.stringify(data),
                    process.env.JWT_SECRET
                  );
                  otpStorage.set(email, otp);
                  res.status(201).json({
                    success: true,
                    message: "User Account Created Successfully!",
                    otp: otp,
                    data: data,
                    token: token,
                  });
                })
                .catch((err) => {
                  fs.rmSync(path);
                  res
                    .status(400)
                    .json({ success: false, message: err.message });
                });
            })
            .catch((err) => {
              fs.rmSync(path);
              res.status(400).json({ success: false, message: err });
            });
        }
      })
      .catch((err) => {
        fs.rmSync(path);

        res.status(400).json({ success: false, message: err });
      });
  }
  static verifyEmail(req, res) {
    const { otp } = req.body;
    var token = req.headers.authorization.split("Bearer ")[1];
    const data = jwt.decode(token);

    User.findByIdAndUpdate(data._id, { $set: { isVerified: true } })
      .then((doc) => {
        if (doc) {
          otpStorage.set(doc.email, otpStorage.get(doc.email));

          if (otpStorage.has(doc.email) && otpStorage.get(doc.email) === otp) {
            otpStorage.delete();
            res.json({
              success: true,
              message: "User verified successfully!",
              data: doc,
            });
          } else {
            res
              .status(400)
              .json({ success: false, message: "check your entered otp" });
          }
        } else {
          res.status(400).json({ success: false, message: "User not found!" });
        }
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static updateProfile(req, res) {
    var token = req.headers.authorization.split("Bearer ")[1];
    const data = jwt.decode(token);
    const {
      gender,
      address,
      latitude,
      longitude,
      profile,
      mobile,
      firstName,
      lastName,
    } = req.body;
    var filePath = "";
    var profilePath = "";
    if (profile) {
      filePath = base64_decode(profile, "profile", "profile", "png");
      profilePath = filePath.split("public/")[1];
    }
    User.findByIdAndUpdate(
      data._id,
      {
        $set: {
          gender: gender,
          location: {
            latitude: latitude,
            longitude: longitude,
            address: address,
          },
          profile: profilePath,
          firstName: firstName,
          lastName: lastName,
          mobile: mobile,
        },
      },
      { new: true }
    )
      .then((doc) => {
        if (doc) {
          res.json(doc);
        } else {
          res.status(400).json({ success: false, message: "User not found!" });
        }
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static googleSignin(req, res) {
    const { email, firstName, lastName, imageUrl, referrer } = req.body;

    User.findOne({ email: email })
      .then(async (doc) => {
        if (doc) {
          var token = jwt.sign(JSON.stringify(doc), process.env.JWT_SECRET);

          res.json({
            success: true,
            message: "User LoggedIn Successfully!",
            data: doc,
            token: token,
          });
        } else {
          var imagePath = "public/ ";
          if (imageUrl && imageUrl != " ") {
            imagePath = await downloadAndSaveImage(
              imageUrl,
              "profile",
              "profile",
              "png"
            );
          }

          var user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: " ",
            isVerified: true,
            referralCode: generateShortCode(referrer),
            referrerCode: referrer,
            mobile: " ",
            password: " ",
            location: {
              address: " ",
              latitude: " ",
              longitude: " ",
            },
            profile: imagePath.split("public/")[1],
          });
          await user
            .save()
            .then((data) => {
              var token = jwt.sign(
                JSON.stringify(data),
                process.env.JWT_SECRET
              );

              res.json({
                success: true,
                message: "User LoggedIn Successfully!",
                data: data,
                token: token,
              });
            })
            .catch((err) => {
              res.status(400).json({ success: false, message: err.message });
            });
        }
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static async sendOtp(req, res) {
    const { email } = req.body;
    await User.findOne({ email: email })
      .then(async (doc) => {
        if (!doc) {
          res.status(400).json({ success: false, message: "User not found!" });
        } else {
          const otp = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false,
          });
          await sendEmail(email, otp);
          var token = jwt.sign(JSON.stringify(doc), process.env.JWT_SECRET);
          otpStorage.set(email, otp);
          res.status(200).json({
            success: true,
            message: "Otp has been send your email!",
            otp: otp,
            data: doc,
            token: token,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static async updatePassword(req, res) {
    const { email, password } = req.body;

    var user = await User.findOne({ email: email });
    if (user) {
      var pass = await bcrupt.hash(password, 10);

      await User.findOneAndUpdate(
        { email: email },
        { $set: { password: pass } },
        { new: true }
      )
        .then((doc) => {
          res.json({
            success: true,
            message: "Password has been updated successfully!",
            data: doc,
          });
        })
        .catch((err) => {
          res.status(400).json({ success: false, message: err.message });
        });
    } else {
      res
        .status(400)
        .json({ success: false, message: "User not found with this email!" });
    }
  }
  static getAllUsers(req, res) {
    var token = req.headers.authorization.split("Bearer ")[1];
    const email = jwt.decode(token).email;
    User.find({ email: { $ne: email }, isVerified: true })
      .then((doc) => {
        res.status(400).json({
          success: false,
          message: "User data has been fetched!",
          data: doc,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static getDataById(req, res) {
    var { userId } = req.query;

    User.findById(userId).then((doc) => {
      res.json({ success: true, message: "User Data Fetched", data: doc });
    });
  }
  static updateFcm(req, res) {
    var token = req.headers.authorization.split("Bearer ")[1];
    const id = jwt.decode(token)._id;
    var { fcmToken } = req.body;
    User.findByIdAndUpdate(id, { fcmToken: fcmToken })
      .then((doc) => {
        res.json({ success: true, message: "user token updated successfully" });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
}

exports.AuthController = AuthController;
