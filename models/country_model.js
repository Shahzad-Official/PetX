const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    countryName: String,
    countryIso: String,
    currencyName: String,
    currencyCode: String,
    currencySymbol: String,
  },
  {
    versionKey: false,
  }
);

const Country = mongoose.model("Countries", countrySchema);

module.exports = Country;
