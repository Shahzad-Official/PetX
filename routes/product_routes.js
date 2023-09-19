const express = require("express");
const { verifyToken } = require("../middlewares/auth_middleware");
const ProductController = require("../controllers/product_controller");
const router = express.Router();

router.post("/", verifyToken,ProductController.addProduct);

module.exports.productRoutes=router;
