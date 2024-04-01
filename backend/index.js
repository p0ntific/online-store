require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorMiddleware = require("./middlewares/ErrorHandlingMiddleware");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

//обработка ошибки
app.use(errorMiddleware);
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`server is running... on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
