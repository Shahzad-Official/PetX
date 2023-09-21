const express = require("express");
const { verifyToken } = require("../middlewares/auth_middleware");
const ProductController = require("../controllers/product_controller");
const ProductMiddlewares = require("../middlewares/product_middlewares");
const router = express.Router();

router.post("/", verifyToken,ProductMiddlewares.createProduct,ProductController.addProduct);
router.get("/",ProductController.getAllProducts);

module.exports.productRoutes=router;
