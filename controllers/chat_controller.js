const Message = require("../models/message_model");
const Room = require("../models/room_model");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const { sendFcmNotification } = require("../utils/app_functions");

class ChatController {
  static async sendMessage(data) {
    const { roomId, senderId, receiverId, message } = data;
    const messageModel = new Message({
      roomId: roomId,
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });
    let doc2;
    var doc = await User.findById(receiverId).where({ isOnline: false });

    await User.findById(senderId).then((result) => {
      doc2 = result;
    });

    var data = await messageModel.save();
    if (doc) {
      sendFcmNotification(
        doc.fcmToken,
        "You have an unread message",
        `${doc2.firstName} ${doc2.lastName} has send you a message.`,
        data
      );
    }

    return data;
  }
  static async createRoom(req, res) {
    const { senderId, receiverId } = req.body;
    var usersToCheck = [senderId, receiverId];
    await Room.findOne({ users: { $all: usersToCheck } })
      .then((doc) => {
        if (doc) {
          res.json({
            success: true,
            message: "Room is already available",
            data: doc,
          });
        } else {
          const room = new Room({
            users: usersToCheck,
          });
          room
            .save()
            .then((data) => {
              res.json({
                success: true,
                message: "Room has been created",
                data: data,
              });
            })
            .catch((err) => {
              res.status(400).json({ success: false, message: err.message });
            });
        }
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static async getChats(req, res) {
    const { roomId, receiverId } = req.query;

    const token = req.headers.authorization.split(" ")[1];
    const senderId = jwt.decode(token)._id;

    var pipeline = [];

    if (roomId) {
      pipeline.push({
        $match: {
          roomId: roomId,
        },
      });
    } else if (receiverId) {
      var doc = await Room.findOne({ users: { $all: [receiverId, senderId] } });

      if (doc) {
        var newRoomId = doc._id.toHexString();
        pipeline.push({
          $match: {
            roomId: newRoomId,
          },
        });
      }
    }

    Message.aggregate(pipeline)
      .then((doc) => {
        res.json({
          success: true,
          message: "Messages has been fetched",
          data: doc,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  }
  static async checkLastMessage(req, res) {
    const { receiverId } = req.query;

    const token = req.headers.authorization.split(" ")[1];
    const senderId = jwt.decode(token)._id;

    var doc = await Room.findOne({ users: { $all: [receiverId, senderId] } });

    if (doc) {
      var newRoomId = doc._id.toHexString();
      Message.findOne({ roomId: newRoomId })
        .sort({ _id: -1 })
        .then((doc) => {
          res.json({
            success: true,
            message: "Message has been fetched",
            data: doc,
          });
        })
        .catch((err) => {
          res.status(400).json({ success: false, message: err.message });
        });
    } else {
      res.status(400).json({ success: false, message: "No Message found" });
    }
  }
}
module.exports = ChatController;
