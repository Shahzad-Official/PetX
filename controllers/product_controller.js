const mongoose = require("mongoose");
const Product = require("../models/product_model");
const User = require("../models/user_model");

const {
  saveListOfFiles,
  base64_decode,
  calculateDate,
} = require("../utils/app_functions");
const jwt = require("jsonwebtoken");

class ProductController {
  static async addProduct(req, res) {
    const {
      categoryId,
      country,
      description,
      name,
      otherPics,
      price,
      thumbnail,

      address,
      latitude,
      longitude,
    } = req.body;
    var token = req.headers.authorization.split("Bearer ")[1];
    const data = jwt.decode(token);
    var user = await User.findById(data._id);
    var subscription = "free";
    var finalDate = calculateDate(10);
    if (user) {
      let thumbnailImage;
      let productThumbnail;
      var otherImages = [];
      var filesPath = [];

      thumbnailImage = base64_decode(thumbnail, "product", "thumbnail", "png");
      productThumbnail = thumbnailImage.split("public/")[1];

      filesPath = saveListOfFiles(otherPics, "product", name, "png");

      filesPath.forEach((e) => {
        otherImages.push(e.split("public/")[1]);
      });

      subscription = user.subscription;
      if (subscription == "free") {
        finalDate = calculateDate(10);
      } else if (subscription == "basic") {
        finalDate = calculateDate(30);
      } else if (subscription == "gold") {
        finalDate = calculateDate(90);
      } else if (subscription == "premium") {
        finalDate = calculateDate(60);
      }
      const startDate = new Date();

      var product = new Product({
        categoryId: categoryId,
        country: country,
        description: description,
        endDate: finalDate,
        name: name,
        otherPics: otherImages,
        price: price,
        startDate: startDate,
        thumbnail: productThumbnail,
        userId: data._id,
        location: {
          address: address,
          latitude: latitude,
          longitude: longitude,
        },
      });
      await product
        .save()
        .then((doc) => {
          res.status(201).json({
            success: true,
            message: "Product has been created successfully!",
            data: doc,
          });
        })
        .catch((err) => {
          res.status(400).json({ success: false, message: err.message });
        });
    } else {
      res.status(404).json({ success: false, message: "User not found!" });
    }
  }
  static async getAllProducts(req, res) {
    var { catId, page, perPage, userId } = req.query;
    const currentPage = parseInt(page) || 1;
    var perPageCount = parseInt(perPage) || 10;

    const skip = (currentPage - 1) * perPageCount;
    var startDate = new Date();
    var mainPipeline = [
      {
        $match: {
          endDate: { $gte: startDate },
        },
      },
    ];

    if (catId) {
      mainPipeline.unshift({
        $match: {
          categoryId: catId,
        },
      });
    }
    if (userId) {
      mainPipeline.unshift({
        $match: {
          userId: userId,
        },
      });
    }
    var docs = await Product.aggregate(mainPipeline);
    var totalPages = docs.length / perPageCount;

    const roundedValue = Math.ceil(totalPages);

    mainPipeline.push(
      {
        $sort: {
          startDate: -1,
        },
      },
      {
        $addFields: {
          userId: {
            $toObjectId: "$userId",
          },
          categoryId: {
            $toObjectId: "$categoryId",
          },
        },
      },
      {
        $lookup: {
          as: "User",
          from: "users",
          foreignField: "_id",
          localField: "userId",
        },
      },
      {
        $unwind: "$User",
      },
      {
        $lookup: {
          as: "Category",
          from: "categories",
          foreignField: "_id",
          localField: "categoryId",
        },
      },
      {
        $skip: skip,
      },
      {
        $unwind: "$Category",
      },
      {
        $limit: perPageCount,
      }
    );

    Product.aggregate(mainPipeline)
      .then((doc) => {
        res.json({
          success: true,
          message: "Products have been fetched",
          data: doc,
          length: doc.length,
          perPage: perPageCount,
          totalPages: roundedValue,
          totalDocs: docs.length,
          currentPage: currentPage,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
}

module.exports = ProductController;
