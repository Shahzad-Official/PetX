const mongoose = require("mongoose");
var roomSchema = new mongoose.Schema(
  {
    createdOn: {
      type: Date,
      default: Date.now,
    },
    users: [String],
  },
  { versionKey: false }
);

const Room = mongoose.model("chatrooms", roomSchema);

module.exports = Room;
