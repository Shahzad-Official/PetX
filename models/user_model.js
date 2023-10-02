const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    mobileCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
        required: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    subscription: {
      type: String,
      enum: ["free", "basic", "premium", "gold"],
      default: "free",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    fcmToken: {
      type: String,
    },
    referralCode: {
      type: String,
    },
    referrerCode: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
