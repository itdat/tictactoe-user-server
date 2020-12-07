//DB config
require("dotenv").config();
const mongoose = require("mongoose");
const config = require("config");



const DB = config
  .get("mongoURI")
  .replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  .replace("<DB_NAME>", process.env.DATABASE_NAME);
//Connect to Mongo
const connectDB = async () => {
  try {

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("DB connection successful");
  } catch (err) {
    console.log("Can't connect to MongoDB");
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;