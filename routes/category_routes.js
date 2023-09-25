const express = require("express");
const { verifyToken } = require("../middlewares/auth_middleware");
const CategoryController = require("../controllers/category_controller");
const {
  createCategoryMiddleware,
} = require("../middlewares/category_middleware");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  createCategoryMiddleware,
  CategoryController.createCategory
);
router.get("/", verifyToken, CategoryController.getAllCategories);

const CategoryRoutes = router;

module.exports = CategoryRoutes;
