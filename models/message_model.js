const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["photo", "audio", "video", "text"],
      default: "text",
    },
    message: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
