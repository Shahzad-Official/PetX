const joi = require("joi");
class ProductMiddlewares {
  static async createProduct(req, res, next) {
    var joiSchema = joi.object({
      categoryId: joi.string().required(),
      country: joi.string().required(),
      description: joi.string().required(),
      name: joi.string().required(),
      otherPics: joi.array().items(joi.string()).required(),
      price: joi.string().required(),
      thumbnail: joi.string().required(),
      address: joi.string().required(),
      latitude: joi.string().required(),
      longitude: joi.string().required(),
    });
    var { error, value } = joiSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
    } else {
      next();
    }
  }
}

module.exports = ProductMiddlewares;
