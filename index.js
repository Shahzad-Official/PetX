const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const AuthRoutes = require("./routes/auth_routes");
const ChatRoutes = require("./routes/chat_routes");
const ProductRoutes = require("./routes/product_routes");
const CategoryRoutes = require("./routes/category_routes");
const ChatController = require("./controllers/chat_controller");
const User = require("./models/user_model");
const jwt = require("jsonwebtoken");
const axios=require("axios");
const otpGenerator=require("otp-generator");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "20mb",
  })
);

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/PetX", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((value) => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("connection error" + err);
  });

app.use("/api/profile", express.static("./public/profile"));
app.use("/api/icon", express.static("./public/icon"));
app.use("/api/product", express.static("./public/product"));
app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/product", ProductRoutes);

app.use("/api/chat", ChatRoutes);

app.get("/api/countries/currencies", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const skip = (page - 1) * perPage;

    var totalCountries = await Country.find();
    await Country.find()
      .limit(perPage)
      .skip(skip)
      .then((doc) => {
        var totalPages = totalCountries.length / perPage;

        const roundedValue = Math.ceil(totalPages);

        res.json({
          success: true,
          data: doc,
          page: page,
          perPage: perPage,
          totalDocs: totalCountries.length,
          totalPages: roundedValue,
          length: doc.length,
        });
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/sendOtp", async (req, res) => {
  
  var url = "https://secure.h3techs.com/sms/api/send";
  var otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });
  var { phone } = req.body;
  const config = {
    params: {
      email: "mushwaririder@gmail.com",
      to: phone,
      $mask : "81478",
      key: "09c31c4800093079e4372d6c794f0d3c45",
      message: `Your OTP code is for mushwari app ${otp}. For any issue please contact us +923284109818 or visit www.mushwari.com`,
    },
  };
  var countryCode = phone.substring(0, 3);
  if (countryCode == "+92") {
    try {
      var response = await axios.get(url, config);
      res.json({
        success: true,
        message: "Otp has been sent successfully.",
        data: response.data,
        otp: otp,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });
    }
  } else {
    client.messages
      .create({
        body:
          "MUSHWARI Sent You One Time Passcode " +
          otp +
          " Is Valid For 5 Minutes. For More Information please visit www.mushwari.com",
        messagingServiceSid: "MG053deefe09bb1ffe23c4437c1bc93893",
        to: phone,
      })
      .then((message) => {
        res.json({
          success: true,
          message: "Otp has been sent successfully.",
          data: {
            message: message.body,
            status: message.status,
            from: message.from,
            to: message.to,
            sendDate: message.dateCreated,
            errorCode: message.errorCode,
            errorMessage: message.errorMessage,
          },
          otp: otp,
        });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error." });
      });
  }
});

const io = new Server(server);

app.use("/",(req,res)=>{
  res.json({message:"Hello world"});
})

io.on("connection", (client) => {
  console.log("user connected " + client.id);
  let user;
  client.on("updateStatus", async (data) => {
    await User.findByIdAndUpdate(
      data.userId,
      { $set: { isOnline: data.isOnline, lastActive: new Date() } },
      { new: true }
    ).then((doc) => {
      var token = jwt.sign(JSON.stringify(doc), process.env.JWT_SECRET);
      const obj = {
        success: true,
        message: "User LoggedIn Successfully!",
        data: doc,
        token: token,
      };

      user = JSON.stringify(obj);
    });

    client.emit("updatedStatus", user);
  });

  client.on("join_room", (roomId) => {
    client.join(roomId.toString());
  });
  client.on("message", async (doc) => {
    var data = JSON.parse(doc);
    var room = data.roomId.toString();
    var messageData = await ChatController.sendMessage(data);

    client.to(room).emit("message", messageData);
  });
  client.on("isTyping", (roomId) => {
    client.to(roomId).emit("isTyping", true);
  });
  client.on("offline", (roomId) => {
    client.to(roomId).emit("offline", true);
  });
  client.on("online", (roomId) => {
    client.to(roomId).emit("online", true);
  });
  client.on("stopTyping", (roomId) => {
    client.to(roomId).emit("stopTyping", true);
  });

  client.on("disconnect", (data) => {
    console.log("user disconnected " + client.id);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
