const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//* Load ENV
const envMode = process.env.NODE_ENV === "production";

if (!envMode) {
  dotenv.config();
}

//* Connect To DB
async function connectToDB() {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      authSource: "admin",
      useNewUrlParser: true,
    });
    console.log(
      `MongoDB Conneted Succesfully On Host:  ${mongoose.connection.host} `
    );
  } catch (err) {
    console.log(`Error In DB Connection -> ${err}`);
    process.exit(1);
  }
}

//* Start Server
function startServer() {
  const port = +process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(
      `Server Running ${
        envMode ? "production" : "development"
      } mode On Port ${port}`
    );
  });
}

//* Run Project
async function run() {
  startServer();
  await connectToDB();
}

run();
