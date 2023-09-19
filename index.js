const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cookie=require("cookie-parser");


const { authRoutes } = require("./routes/auth_routes");
const { categoryRoutes } = require("./routes/category_routes");
const { sendEmail, downloadAndSaveImage } = require("./utils/app_functions");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/BirdX", {
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
app.use("/api/auth", authRoutes);
app.use("/api/cat", categoryRoutes);



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
