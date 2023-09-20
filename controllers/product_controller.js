const Product = require("../models/product_model");
const User = require("../models/user_model");
const { endDate } = require("../utils/app_functions");
const jwt=require("jsonwebtoken");

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
    var finalDate = endDate(10);
    if (user) {
      subscription = user.subscription;
      if (subscription == "free") {
        finalDate = endDate(10);
      } else if (subscription == "basic") {
        finalDate = endDate(30);
      } else if (subscription == "gold") {
        finalDate = endDate(90);
      } else if (subscription == "premium") {
        finalDate = endDate(60);
      }
      const startDate = new Date();
      res.json({
        success: true,
        data: {
          startDate: startDate,
          endDate: finalDate,
          subscription: subscription,
        },
      });
      // var product=new Product({
      //      categoryId:categoryId,
      //      country:country,
      //      description:description,
      //      endDate:endDate,
      //      name:name,
      //      otherPics:otherPics,
      //      price:price,
      //      startDate:startDate,
      //      thumbnail:thumbnail,
      //      userId:userId,
      //      location:{
      //         address:address,
      //         latitude:latitude,
      //         longitude:longitude,
      //      },

      // });
    } else {
      res.json({ success: false, message: "User not found!" });
    }
  }
}

module.exports = ProductController;
