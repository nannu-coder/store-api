const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose.connect("mongodb://127.0.0.1:27017/store-api");
};

module.exports = connectDB;
