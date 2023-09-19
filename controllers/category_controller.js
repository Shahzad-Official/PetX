const Category = require("../models/category_model");
const { base64_decode } = require("../utils/app_functions");
const fs = require("fs");

class CategoryController {
  static async createCategory(req, res) {
    const { categoryName, categoryIcon, color } = req.body;
    var path = base64_decode(categoryIcon, "icon", categoryName, "svg");
    Category.findOne({ categoryName: categoryName })
      .then(async (doc) => {
        if (doc) {
          fs.rmSync(path);
          res
            .status(400)
            .json({
              success: false,
              message: "This Category is Already available!",
            });
        } else {
          var category = new Category({
            categoryName: categoryName,
            categoryIcon: path.split("public/")[1],
            color: color,
          });
          await category
            .save()
            .then((data) => {
              res.status(201).json({
                success: true,
                message: "Category Added successfully!",
                data: data,
              });
            })
            .catch((err) => {
              fs.rmSync(path);
              res.status(400).json({ success: false, message: err.message });
            });
        }
      })
      .catch((err) => {
        fs.rmSync(path);
        res.status(400).json({ success: false, message: err.message });
      });
  }
 static async getAllCategories(req,res){
   await Category.find().then((doc)=>{
        res.status(201).json({
            success: true,
            message: "All Categories!",
            data: doc,
          });
    }).catch((err)=>{
        res.status(400).json({ success: false, message: err.message });
    });
 }
}

module.exports = CategoryController;
