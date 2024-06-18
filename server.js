const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

// console.log(process.env);

mongoose.connect("mongodb://127.0.0.1:27017/natour").then(() => {
  console.log("DataBase Connected successfull.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port : ${port}`);
});
