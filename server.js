const express = require("express");
const app = express();
const connectDB = require("./config/db");

//Connect DB
connectDB();

// Init middleware
app.use(express.json());

//Define routes
app.use("/users", require("./routes/index"));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
