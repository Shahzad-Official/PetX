 const express = require('express');
const ChatMiddleware = require('../middlewares/chat_middleware');
const ChatController = require('../controllers/chat_controller');
const { verifyToken } = require('../middlewares/auth_middleware');

const chatRouter=express.Router();

chatRouter.post("/create-room",ChatMiddleware.creatRoom,ChatController.createRoom);
chatRouter.get("/",verifyToken,ChatController.getChats);

module.exports=chatRouter;