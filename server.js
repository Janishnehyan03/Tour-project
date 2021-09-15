const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Uncaught exeption like console.log(x) not defined
process.on("uncaughtException", (err) => {
  console.log("uncaughtException", "Website is going to shut down 😢");
  console.log(err);
  process.exit(1); // 0 for success and 1 for error
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
//development
console.log(app.get("env"));

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
    console.log("DB connected");
  });
// console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

//Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log("Website is going to shut down 😢, ");
  console.log(err);
  server.close(() => {
    process.exit(1); // 0 for success & 1 for rejection
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECIEVED", "shutting down gracefully😴");
  server.close(() => {
    console.log("Please terminate it ");
  });
});
