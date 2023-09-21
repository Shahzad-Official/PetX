const Joi = require("joi");
function createCategoryMiddleware(req, res, next) {
  var joiSchema = Joi.object({
    categoryName: Joi.string().min(3).required(),
    categoryIcon: Joi.string().required(),
    color: Joi.string().required(),
  });
  var { error, value } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
}

module.exports = {
  createCategoryMiddleware,
};
