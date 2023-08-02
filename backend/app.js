/* eslint-disable no-undef */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config");
const app = express();
const port = config.PORT;
const userRouter = require("./routes/userRouter");
const ingredientRouter = require("./routes/ingredientRouter");
const recipeRouter = require("./routes/recipeRouter");
const placeRouter = require("./routes/placeRouter");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
dotenv.config();
const UNSPLASH_ACCESS = process.env.UNSPLASH_ACCESS;

app.get("/random-photo", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/topics/food-drink/photos/?client_id=${UNSPLASH_ACCESS}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});
app.use("/user", userRouter);
app.use("/ingredients", ingredientRouter);
app.use("/recipe", recipeRouter);
app.use("/place", placeRouter);

//!connection
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log("Server is running on port;" + port);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });
