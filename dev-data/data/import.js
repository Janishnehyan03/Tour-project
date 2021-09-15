const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const fs = require("fs");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");
//CONNECT DB
const DB = process.env.DATABASE_ATLAS;
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log("DB CONNECTED");
  });
//read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
//import data into database
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Tour.create(tours);
    console.log("data imported");
    process.exit();
  } catch (error) {
    console.log("🧧", error);
  }
};
//delete all data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    await Review.deleteMany();
    console.log("data deleted");
    process.exit();
  } catch (error) {
    console.log("🧧", error);
  }
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
