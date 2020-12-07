const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const path = require("path");

//DB config
dotenv.config({ path: "./config/.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
//Connect to Mongo
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful");
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
