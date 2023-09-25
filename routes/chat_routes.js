 const express = require('express');
const ChatMiddleware = require('../middlewares/chat_middleware');
const ChatController = require('../controllers/chat_controller');
const { verifyToken } = require('../middlewares/auth_middleware');

const router=express.Router();

router.post("/create-room",ChatMiddleware.creatRoom,ChatController.createRoom);
router.get("/",verifyToken,ChatController.getChats);

const ChatRoutes=router;

module.exports=ChatRoutes;