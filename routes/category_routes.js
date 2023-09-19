const express=require("express");
const { verifyToken } = require("../middlewares/auth_middleware");
const CategoryController = require("../controllers/category_controller");

const router=express.Router();

router.post("/",verifyToken,CategoryController.createCategory);
router.get("/",verifyToken,CategoryController.getAllCategories);

module.exports.categoryRoutes =router;