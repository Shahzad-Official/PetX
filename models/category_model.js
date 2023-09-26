const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryIcon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);
const Category = mongoose.model("Categories", categorySchema);
module.exports = Category;
