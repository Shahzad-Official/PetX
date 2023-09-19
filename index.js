const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cookie = require("cookie-parser");


const { authRoutes } = require("./routes/auth_routes");
const { categoryRoutes } = require("./routes/category_routes");

const { productRoutes } = require("./routes/product_routes");
const Country = require("./models/country_model");

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
app.use("/api/product", productRoutes);
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
          length:doc.length,
        });
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
