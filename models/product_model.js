const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Pakistan",
    },
    userId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
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
    thumbnail: {
      type: String,
      required: true,
    },
    otherPics: [String],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);
var Product = mongoose.model("products", productSchema);
module.exports = Product;
