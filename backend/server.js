const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "../backend/dist/index.html"));
});

app.listen(36345);
