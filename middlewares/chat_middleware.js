const Joi = require("joi");
class ChatMiddleware {
  static sendMessage(req, res, next) {
    const joiSchema = Joi.object({
      roomId: Joi.string().required(),
      senderId: Joi.string().required(),
      receiverId: Joi.string().required(),
      message: Joi.string().required(),
    });
    var { error, value } = joiSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error["details"][0] });
    } else {
      next();
    }
  }
  static creatRoom(req, res, next) {
    var joiSchema = Joi.object({
      senderId: Joi.string().required(),
      receiverId: Joi.string().required(),
    });
    var { error, value } = joiSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error["details"][0].message });
    } else {
      next();
    }
  }
}

module.exports = ChatMiddleware;
