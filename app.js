require("express-async-errors");
const express = require("express");
const app = express();
const port = 5000;
const dotenv = require("dotenv").config();
const connectDB = require("./DB/Conect");
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const productsRoute = require("./routes/productsRoute");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/products", productsRoute);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
