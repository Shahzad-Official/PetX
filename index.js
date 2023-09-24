const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");


const { authRoutes } = require("../PetX/routes/auth_routes");
const { categoryRoutes } = require("../PetX/routes/category_routes");

const { productRoutes } = require("../PetX/routes/product_routes");
const Country = require("../PetX/models/country_model");

const { Server } = require("socket.io");
const { authRoutes } = require("./routes/auth_routes");
const { categoryRoutes } = require("./routes/category_routes");
const cors = require("cors");
const { productRoutes } = require("./routes/product_routes");
const Country = require("./models/country_model");
const chatRouter = require("./routes/chat_routes");
const ChatController = require("./controllers/chat_controller");
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
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.use("/api/chat", chatRouter);

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




const io = new Server(server);

io.on("connection", client => {
  console.log("user connected " + client.id);
  client.on("join_room", (roomId) => {

    client.join(roomId.toString());

  });
  client.on("message", async (doc) => {
    var data = JSON.parse(doc);
    var room = data.roomId.toString();
    var messageData = await ChatController.sendMessage(data);


    client.to(room).emit("message", messageData);


  });


  client.on("disconnect", (data) => {
    console.log("user disconnected" + data);
  })
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));

